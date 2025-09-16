use async_graphql::{
    http::GraphiQLSource, Context, EmptySubscription, Error, Object, Schema,
};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    debug_handler,
    response::{self, IntoResponse},
    routing::get,
    Extension,
};
use loco_rs::prelude::*;
use sea_orm::Set;
use serde_json::Value;

use crate::models::{
    _entities::{character_sheets, prelude::*},
    character_sheets::CharacterSheet as CharacterSheetModel,
};

// The root query object
pub struct QueryRoot;

#[Object]
impl QueryRoot {
    /// A simple query to check if the GraphQL endpoint is running.
    async fn hello(&self) -> &'static str {
        "Hello, world!"
    }

    /// Fetches a character sheet by its ID.
    async fn sheet(
        &self,
        ctx: &Context<'_>,
        id: i32,
    ) -> async_graphql::Result<Option<CharacterSheetModel>> {
        let state = ctx.data::<AppContext>()?;

        let sheet = CharacterSheets::find_by_id(id)
            .one(&state.db)
            .await
            .map_err(|e| {
                tracing::error!("Failed to fetch character sheet by ID: {:?}", e);
                Error::new("Database error while fetching character sheet.")
            })?;

        if let Some(sheet) = sheet {
            Ok(Some(CharacterSheetModel {
                id: sheet.id,
                data: sheet.data,
            }))
        } else {
            Ok(None)
        }
    }
}

// The root mutation object
pub struct MutationRoot;

#[Object]
impl MutationRoot {
    /// Creates a new character sheet.
    /// Takes a JSON object `data` as input, which can be any valid JSON.
    async fn create_sheet(
        &self,
        ctx: &Context<'_>,
        data: Value,
    ) -> async_graphql::Result<CharacterSheetModel> {
        let state = ctx.data::<AppContext>().map_err(|e| {
            tracing::error!("Failed to get AppContext: {:?}", e);
            Error::new("Could not get application context")
        })?;

        let new_sheet = character_sheets::ActiveModel {
            data: Set(data.clone()),
            ..Default::default()
        };

        let res = CharacterSheets::insert(new_sheet)
            .exec(&state.db)
            .await
            .map_err(|e| {
                tracing::error!("Failed to insert character sheet: {:?}", e);
                Error::new("Failed to save character sheet to the database.")
            })?;

        Ok(CharacterSheetModel {
            id: res.last_insert_id,
            data,
        })
    }

    /// Updates an existing character sheet.
    /// Replaces the entire `data` object with the new provided data.
    async fn update_sheet(
        &self,
        ctx: &Context<'_>,
        id: i32,
        data: Value,
    ) -> async_graphql::Result<CharacterSheetModel> {
        let state = ctx.data::<AppContext>()?;

        // First, find the sheet to make sure it exists.
        let sheet = CharacterSheets::find_by_id(id)
            .one(&state.db)
            .await?
            .ok_or_else(|| Error::new(format!("Character sheet with ID {} not found.", id)))?;

        let mut active_sheet: character_sheets::ActiveModel = sheet.into();
        active_sheet.data = Set(data.clone());

        let updated_sheet = active_sheet.update(&state.db).await?;

        Ok(CharacterSheetModel {
            id: updated_sheet.id,
            data: updated_sheet.data,
        })
    }

    /// Deletes a character sheet by its ID.
    /// Returns true if a sheet was deleted, false otherwise.
    async fn delete_sheet(
        &self,
        ctx: &Context<'_>,
        id: i32,
    ) -> async_graphql::Result<bool> {
        let state = ctx.data::<AppContext>()?;

        let res = CharacterSheets::delete_by_id(id).exec(&state.db).await?;

        Ok(res.rows_affected == 1)
    }
}

// The GraphQL schema
pub type AppSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

// The Axum handler for GraphQL requests
#[debug_handler]
async fn graphql_handler(
    schema: Extension<AppSchema>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

// The Axum handler for the GraphiQL UI
async fn graphiql() -> impl IntoResponse {
    response::Html(GraphiQLSource::build().endpoint("/api/sheets").finish())
}

// The routes function that ties everything together
pub fn routes() -> Routes {
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription).finish();

    Routes::new()
        .prefix("/api/sheets")
        .add("/", get(graphiql).post(graphql_handler))
        .layer(Extension(schema))
}
