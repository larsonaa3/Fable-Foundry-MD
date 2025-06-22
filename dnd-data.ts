import { TFile } from 'obsidian';

export const DND_DATA = {
    classes: {
        "Artificer": {
            hitDie: 8,
            primaryAbility: ["Intelligence"],
            savingThrows: ["Constitution", "Intelligence"],
            subclasses: ["Alchemist", "Armorer", "Artillerist", "Battle Smith"],
            spellcaster: true,
            spellcastingAbility: "Intelligence",
            spellSlots: {
                1: [2], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2],
                10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1],
                15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1],
                19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2]
            }
        },
        "Barbarian": {
            hitDie: 12,
            primaryAbility: ["Strength"],
            savingThrows: ["Strength", "Constitution"],
            subclasses: ["Path of the Berserker", "Path of the Totem Warrior", "Path of the Ancestral Guardian", "Path of the Storm Herald", "Path of the Zealot"],
            spellcaster: false
        },
        "Bard": {
            hitDie: 8,
            primaryAbility: ["Charisma"],
            savingThrows: ["Dexterity", "Charisma"],
            subclasses: ["College of Lore", "College of Valor", "College of Glamour", "College of Swords", "College of Whispers"],
            spellcaster: true,
            spellcastingAbility: "Charisma",
            spellSlots: {
                1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
                8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
                12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
                15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
                18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
            }
        },
        "Cleric": {
            hitDie: 8,
            primaryAbility: ["Wisdom"],
            savingThrows: ["Wisdom", "Charisma"],
            subclasses: ["Life Domain", "Light Domain", "Nature Domain", "Tempest Domain", "Trickery Domain", "War Domain", "Death Domain", "Forge Domain", "Grave Domain"],
            spellcaster: true,
            spellcastingAbility: "Wisdom",
            spellSlots: {
                1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
                8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
                12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
                15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
                18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
            }
        },
        "Druid": {
            hitDie: 8,
            primaryAbility: ["Wisdom"],
            savingThrows: ["Intelligence", "Wisdom"],
            subclasses: ["Circle of the Land", "Circle of the Moon", "Circle of Dreams", "Circle of the Shepherd"],
            spellcaster: true,
            spellcastingAbility: "Wisdom",
            spellSlots: {
                1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
                8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
                12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
                15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
                18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
            }
        },
        "Fighter": {
            hitDie: 10,
            primaryAbility: ["Strength", "Dexterity"],
            savingThrows: ["Strength", "Constitution"],
            subclasses: ["Champion", "Battle Master", "Eldritch Knight", "Arcane Archer", "Cavalier", "Samurai"],
            spellcaster: false
        },
        "Monk": {
            hitDie: 8,
            primaryAbility: ["Dexterity", "Wisdom"],
            savingThrows: ["Strength", "Dexterity"],
            subclasses: ["Way of the Open Hand", "Way of Shadow", "Way of the Four Elements", "Way of the Drunken Master", "Way of the Kensei", "Way of the Sun Soul"],
            spellcaster: false
        },
        "Paladin": {
            hitDie: 10,
            primaryAbility: ["Strength", "Charisma"],
            savingThrows: ["Wisdom", "Charisma"],
            subclasses: ["Oath of Devotion", "Oath of the Ancients", "Oath of Vengeance", "Oath of Conquest", "Oath of Redemption", "Oathbreaker"],
            spellcaster: true,
            spellcastingAbility: "Charisma",
            spellSlots: {
                2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2],
                10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1],
                15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1],
                19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2]
            }
        },
        "Ranger": {
            hitDie: 10,
            primaryAbility: ["Dexterity", "Wisdom"],
            savingThrows: ["Strength", "Dexterity"],
            subclasses: ["Beast Master", "Hunter", "Gloom Stalker", "Horizon Walker", "Monster Slayer"],
            spellcaster: true,
            spellcastingAbility: "Wisdom",
            spellSlots: {
                2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2],
                10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1],
                15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1],
                19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2]
            }
        },
        "Rogue": {
            hitDie: 8,
            primaryAbility: ["Dexterity"],
            savingThrows: ["Dexterity", "Intelligence"],
            subclasses: ["Thief", "Assassin", "Arcane Trickster", "Inquisitive", "Mastermind", "Scout", "Swashbuckler"],
            spellcaster: false
        },
        "Sorcerer": {
            hitDie: 6,
            primaryAbility: ["Charisma"],
            savingThrows: ["Constitution", "Charisma"],
            subclasses: ["Draconic Bloodline", "Wild Magic", "Divine Soul", "Shadow Magic", "Storm Sorcery"],
            spellcaster: true,
            spellcastingAbility: "Charisma",
            spellSlots: {
                1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
                8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
                12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
                15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
                18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
            }
        },
        "Warlock": {
            hitDie: 8,
            primaryAbility: ["Charisma"],
            savingThrows: ["Wisdom", "Charisma"],
            subclasses: ["The Archfey", "The Fiend", "The Great Old One", "The Celestial", "The Hexblade"],
            spellcaster: true,
            spellcastingAbility: "Charisma",
            spellSlots: {
                1: [1], 2: [2], 3: [2], 4: [2], 5: [2], 6: [2], 7: [2], 8: [2], 9: [2], 10: [2],
                11: [3], 12: [3], 13: [3], 14: [3], 15: [3], 16: [3], 17: [4], 18: [4], 19: [4], 20: [4]
            }
        },
        "Wizard": {
            hitDie: 6,
            primaryAbility: ["Intelligence"],
            savingThrows: ["Intelligence", "Wisdom"],
            subclasses: ["School of Abjuration", "School of Conjuration", "School of Divination", "School of Enchantment", "School of Evocation", "School of Illusion", "School of Necromancy", "School of Transmutation", "War Magic", "Bladesinging"],
            spellcaster: true,
            spellcastingAbility: "Intelligence",
            spellSlots: {
                1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
                8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
                12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
                15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
                18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
            }
        }
    },
    races: {
        "Dragonborn": {
            subraces: ["Black", "Blue", "Brass", "Bronze", "Copper", "Gold", "Green", "Red", "Silver", "White"],
            abilityScoreIncrease: { strength: 2, charisma: 1 },
            size: "Medium",
            speed: 30
        },
        "Dwarf": {
            subraces: ["Hill Dwarf", "Mountain Dwarf", "Duergar"],
            abilityScoreIncrease: { constitution: 2 },
            size: "Medium",
            speed: 25
        },
        "Elf": {
            subraces: ["High Elf", "Wood Elf", "Dark Elf (Drow)"],
            abilityScoreIncrease: { dexterity: 2 },
            size: "Medium",
            speed: 30
        },
        "Gnome": {
            subraces: ["Forest Gnome", "Rock Gnome", "Deep Gnome"],
            abilityScoreIncrease: { intelligence: 2 },
            size: "Small",
            speed: 25
        },
        "Half-Elf": {
            subraces: [],
            abilityScoreIncrease: { charisma: 2 },
            size: "Medium",
            speed: 30
        },
        "Half-Orc": {
            subraces: [],
            abilityScoreIncrease: { strength: 2, constitution: 1 },
            size: "Medium",
            speed: 30
        },
        "Halfling": {
            subraces: ["Lightfoot", "Stout"],
            abilityScoreIncrease: { dexterity: 2 },
            size: "Small",
            speed: 25
        },
        "Human": {
            subraces: ["Variant Human"],
            abilityScoreIncrease: {},
            size: "Medium",
            speed: 30
        },
        "Tiefling": {
            subraces: [],
            abilityScoreIncrease: { intelligence: 1, charisma: 2 },
            size: "Medium",
            speed: 30
        }
    },
    backgrounds: [
        "Acolyte", "Criminal", "Folk Hero", "Noble", "Sage", "Soldier", "Charlatan", "Entertainer", 
        "Guild Artisan", "Hermit", "Outlander", "Sailor", "Urchin", "Anthropologist", "Archaeologist",
        "City Watch", "Clan Crafter", "Cloistered Scholar", "Courtier", "Faction Agent", "Far Traveler",
        "Haunted One", "Inheritor", "Investigator", "Knight of the Order", "Mercenary Veteran", "Urban Bounty Hunter"
    ],
    alignments: [
        "Lawful Good", "Neutral Good", "Chaotic Good",
        "Lawful Neutral", "True Neutral", "Chaotic Neutral", 
        "Lawful Evil", "Neutral Evil", "Chaotic Evil"
    ],
    equipment: {
        weapons: {
            "Club": { damage: "1d4", damageType: "bludgeoning", cost: "1 sp", weight: 2, properties: ["Light"] },
            "Dagger": { damage: "1d4", damageType: "piercing", cost: "2 gp", weight: 1, properties: ["Finesse", "Light", "Thrown"] },
            "Dart": { damage: "1d4", damageType: "piercing", cost: "5 cp", weight: 0.25, properties: ["Finesse", "Thrown"] },
            "Javelin": { damage: "1d6", damageType: "piercing", cost: "5 sp", weight: 2, properties: ["Thrown"] },
            "Mace": { damage: "1d6", damageType: "bludgeoning", cost: "5 gp", weight: 4, properties: [] },
            "Quarterstaff": { damage: "1d6", damageType: "bludgeoning", cost: "2 sp", weight: 4, properties: ["Versatile"] },
            "Sickle": { damage: "1d4", damageType: "slashing", cost: "1 gp", weight: 2, properties: ["Light"] },
            "Spear": { damage: "1d6", damageType: "piercing", cost: "1 gp", weight: 3, properties: ["Thrown", "Versatile"] },
            "Crossbow, light": { damage: "1d8", damageType: "piercing", cost: "25 gp", weight: 5, properties: ["Ammunition", "Loading", "Two-handed"] },
            "Shortbow": { damage: "1d6", damageType: "piercing", cost: "25 gp", weight: 2, properties: ["Ammunition", "Two-handed"] },
            "Sling": { damage: "1d4", damageType: "bludgeoning", cost: "1 sp", weight: 0, properties: ["Ammunition"] },
            "Battleaxe": { damage: "1d8", damageType: "slashing", cost: "10 gp", weight: 4, properties: ["Versatile"] },
            "Flail": { damage: "1d8", damageType: "bludgeoning", cost: "10 gp", weight: 2, properties: [] },
            "Glaive": { damage: "1d10", damageType: "slashing", cost: "20 gp", weight: 6, properties: ["Heavy", "Reach", "Two-handed"] },
            "Greataxe": { damage: "1d12", damageType: "slashing", cost: "30 gp", weight: 7, properties: ["Heavy", "Two-handed"] },
            "Greatsword": { damage: "2d6", damageType: "slashing", cost: "50 gp", weight: 6, properties: ["Heavy", "Two-handed"] },
            "Halberd": { damage: "1d10", damageType: "slashing", cost: "20 gp", weight: 6, properties: ["Heavy", "Reach", "Two-handed"] },
            "Lance": { damage: "1d12", damageType: "piercing", cost: "10 gp", weight: 6, properties: ["Reach", "Special"] },
            "Longsword": { damage: "1d8", damageType: "slashing", cost: "15 gp", weight: 3, properties: ["Versatile"] },
            "Maul": { damage: "2d6", damageType: "bludgeoning", cost: "10 gp", weight: 10, properties: ["Heavy", "Two-handed"] },
            "Morningstar": { damage: "1d8", damageType: "piercing", cost: "15 gp", weight: 4, properties: [] },
            "Pike": { damage: "1d10", damageType: "piercing", cost: "5 gp", weight: 18, properties: ["Heavy", "Reach", "Two-handed"] },
            "Rapier": { damage: "1d8", damageType: "piercing", cost: "25 gp", weight: 2, properties: ["Finesse"] },
            "Scimitar": { damage: "1d6", damageType: "slashing", cost: "25 gp", weight: 3, properties: ["Finesse", "Light"] },
            "Shortsword": { damage: "1d6", damageType: "piercing", cost: "10 gp", weight: 2, properties: ["Finesse", "Light"] },
            "Trident": { damage: "1d6", damageType: "piercing", cost: "5 gp", weight: 4, properties: ["Thrown", "Versatile"] },
            "War pick": { damage: "1d8", damageType: "piercing", cost: "5 gp", weight: 2, properties: [] },
            "Warhammer": { damage: "1d8", damageType: "bludgeoning", cost: "15 gp", weight: 2, properties: ["Versatile"] },
            "Whip": { damage: "1d4", damageType: "slashing", cost: "2 gp", weight: 3, properties: ["Finesse", "Reach"] },
            "Crossbow, hand": { damage: "1d6", damageType: "piercing", cost: "75 gp", weight: 3, properties: ["Ammunition", "Light", "Loading"] },
            "Crossbow, heavy": { damage: "1d10", damageType: "piercing", cost: "50 gp", weight: 18, properties: ["Ammunition", "Heavy", "Loading", "Two-handed"] },
            "Longbow": { damage: "1d8", damageType: "piercing", cost: "50 gp", weight: 2, properties: ["Ammunition", "Heavy", "Two-handed"] }
        },
        armor: {
            "Padded": { ac: 11, type: "Light", cost: "5 gp", weight: 8, stealthDisadvantage: true },
            "Leather": { ac: 11, type: "Light", cost: "10 gp", weight: 10, stealthDisadvantage: false },
            "Studded leather": { ac: 12, type: "Light", cost: "45 gp", weight: 13, stealthDisadvantage: false },
            "Hide": { ac: 12, type: "Medium", cost: "10 gp", weight: 12, stealthDisadvantage: false },
            "Chain shirt": { ac: 13, type: "Medium", cost: "50 gp", weight: 20, stealthDisadvantage: false },
            "Scale mail": { ac: 14, type: "Medium", cost: "50 gp", weight: 45, stealthDisadvantage: true },
            "Breastplate": { ac: 14, type: "Medium", cost: "400 gp", weight: 20, stealthDisadvantage: false },
            "Half plate": { ac: 15, type: "Medium", cost: "750 gp", weight: 40, stealthDisadvantage: true },
            "Ring mail": { ac: 14, type: "Heavy", cost: "30 gp", weight: 40, stealthDisadvantage: true },
            "Chain mail": { ac: 16, type: "Heavy", cost: "75 gp", weight: 55, stealthDisadvantage: true },
            "Splint": { ac: 17, type: "Heavy", cost: "200 gp", weight: 60, stealthDisadvantage: true },
            "Plate": { ac: 18, type: "Heavy", cost: "1500 gp", weight: 65, stealthDisadvantage: true },
            "Shield": { ac: 2, type: "Shield", cost: "10 gp", weight: 6, stealthDisadvantage: false }
        },
        adventuringGear: {
            "Backpack": { cost: "2 gp", weight: 5 },
            "Bedroll": { cost: "1 sp", weight: 7 },
            "Blanket": { cost: "5 sp", weight: 3 },
            "Rope, hempen (50 feet)": { cost: "2 gp", weight: 10 },
            "Rope, silk (50 feet)": { cost: "10 gp", weight: 5 },
            "Torch": { cost: "1 cp", weight: 1 },
            "Lantern, bullseye": { cost: "10 gp", weight: 2 },
            "Lantern, hooded": { cost: "5 gp", weight: 2 },
            "Oil (flask)": { cost: "1 sp", weight: 1 },
            "Tinderbox": { cost: "5 sp", weight: 1 },
            "Rations (1 day)": { cost: "2 sp", weight: 2 },
            "Waterskin": { cost: "2 gp", weight: 5 },
            "Coin pouch": { cost: "5 sp", weight: 1 },
            "Crowbar": { cost: "2 gp", weight: 5 },
            "Hammer": { cost: "1 gp", weight: 3 },
            "Piton": { cost: "5 cp", weight: 0.25 },
            "Grappling hook": { cost: "2 gp", weight: 4 }
        }
    },
    spells: {
        0: {
            "Acid Splash": { school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["Artificer", "Sorcerer", "Wizard"] },
            "Chill Touch": { school: "Necromancy", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "1 round", classes: ["Sorcerer", "Warlock", "Wizard"] },
            "Eldritch Blast": { school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous", classes: ["Warlock"] },
            "Fire Bolt": { school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous", classes: ["Artificer", "Sorcerer", "Wizard"] },
            "Guidance": { school: "Divination", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute", classes: ["Artificer", "Cleric", "Druid"] },
            "Light": { school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, M", duration: "1 hour", classes: ["Artificer", "Bard", "Cleric", "Sorcerer", "Wizard"] },
            "Mage Hand": { school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "1 minute", classes: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"] },
            "Minor Illusion": { school: "Illusion", castingTime: "1 action", range: "30 feet", components: "S, M", duration: "1 minute", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"] },
            "Prestidigitation": { school: "Transmutation", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Up to 1 hour", classes: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"] },
            "Sacred Flame": { school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["Cleric"] },
            "Spare the Dying": { school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["Artificer", "Cleric"] },
            "Thaumaturgy": { school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V", duration: "Up to 1 minute", classes: ["Cleric"] },
            "Vicious Mockery": { school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous", classes: ["Bard"] }
        },
        1: {
            "Cure Wounds": { school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"] },
            "Healing Word": { school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V", duration: "Instantaneous", classes: ["Bard", "Cleric", "Druid"] },
            "Magic Missile": { school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous", classes: ["Sorcerer", "Wizard"] },
            "Shield": { school: "Abjuration", castingTime: "1 reaction", range: "Self", components: "V, S", duration: "1 round", classes: ["Sorcerer", "Wizard"] },
            "Burning Hands": { school: "Evocation", castingTime: "1 action", range: "Self (15-foot cone)", components: "V, S", duration: "Instantaneous", classes: ["Sorcerer", "Wizard"] },
            "Detect Magic": { school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes", classes: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Wizard"] },
            "Identify": { school: "Divination", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["Artificer", "Bard", "Wizard"] },
            "Sleep": { school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "1 minute", classes: ["Bard", "Sorcerer", "Wizard"] },
            "Thunderwave": { school: "Evocation", castingTime: "1 action", range: "Self (15-foot cube)", components: "V, S", duration: "Instantaneous", classes: ["Bard", "Druid", "Sorcerer", "Wizard"] }
        }
    },
    experienceTable: {
        1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500, 6: 14000, 7: 23000, 8: 34000, 9: 48000, 10: 64000,
        11: 85000, 12: 100000, 13: 120000, 14: 140000, 15: 165000, 16: 195000, 17: 225000, 18: 265000, 19: 305000, 20: 355000
    }
};

export interface DnDCharacterData {
    name: string;
    class: string;
    subclass: string;
    level: number;
    race: string;
    subrace: string;
    background: string;
    alignment: string;
    multiclass: string[];
    stats: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    backstory: string;
    ideals: string;
    bonds: string;
    flaws: string;
    selectedEquipment: string[];
    selectedSpells: string[];
}

export interface Character {
    name: string;
    file: TFile;
    lastModified: number;
}