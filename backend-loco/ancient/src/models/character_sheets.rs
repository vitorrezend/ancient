use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

/// A character sheet for a tabletop RPG.
/// The `data` field is a flexible JSON object to accommodate different game systems.
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct CharacterSheet {
    pub id: i32,
    pub data: serde_json::Value,
}
