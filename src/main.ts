import { App, Plugin, TFile, Notice } from 'obsidian';
import { DND_DATA, DnDCharacterData, Character } from './dnd-data';
import { CreateDnDCharacterModal } from './modals/character-creation-modal';
import { CreateCharacterModal } from './modals/basic-character-modal';
import { CharacterListModal } from './modals/character-list-modal';
import { EquipmentModal } from './modals/equipment-modal';
import { SpellModal } from './modals/spell-modal';
import { LevelUpModal } from './modals/level-up-modal';
import { CharacterManagerSettingTab } from './settings-tab';

interface CharacterManagerSettings {
    charactersFolder: string;
    defaultTemplate: string;
    useDnDTemplate: boolean;
}

const DEFAULT_SETTINGS: CharacterManagerSettings = {
    charactersFolder: 'Characters',
    useDnDTemplate: true,
    defaultTemplate: `---
name: "{{name}}"
class: "{{class}}"
subclass: "{{subclass}}"
race: "{{race}}"
subrace: "{{subrace}}"
background: "{{background}}"
level: {{level}}
experience: {{experience}}
multiclass: {{multiclass}}
alignment: "{{alignment}}"
stats:
  strength: {{strength}}
  dexterity: {{dexterity}}
  constitution: {{constitution}}
  intelligence: {{intelligence}}
  wisdom: {{wisdom}}
  charisma: {{charisma}}
modifiers:
  strength: {{strMod}}
  dexterity: {{dexMod}}
  constitution: {{conMod}}
  intelligence: {{intMod}}
  wisdom: {{wisMod}}
  charisma: {{chaMod}}
hitPoints:
  max: {{maxHP}}
  current: {{currentHP}}
  temporary: 0
armorClass: {{ac}}
proficiencyBonus: {{profBonus}}
savingThrows: {{savingThrows}}
skills: {{skills}}
languages: {{languages}}
proficiencies: {{proficiencies}}
equipment: {{equipment}}
spells: {{spells}}
spellSlots: {{spellSlots}}
features: {{features}}
backstory: "{{backstory}}"
ideals: "{{ideals}}"
bonds: "{{bonds}}"
flaws: "{{flaws}}"
notes: "{{notes}}"
---

# {{name}}
{{subclassDisplay}}

## Character Summary
**Background:** {{background}}  
**Alignment:** {{alignment}}  
**Armor Class:** {{ac}}  
**Hit Points:** {{maxHP}} ({{currentHP}} current)  
**Speed:** 30 feet  
**Experience:** {{experience}} XP

## Ability Scores
| Ability | Score | Modifier | Saving Throw |
|---------|-------|----------|--------------|
| Strength | {{strength}} | {{strMod}} | {{strSave}} |
| Dexterity | {{dexterity}} | {{dexMod}} | {{dexSave}} |
| Constitution | {{constitution}} | {{conMod}} | {{conSave}} |
| Intelligence | {{intelligence}} | {{intMod}} | {{intSave}} |
| Wisdom | {{wisdom}} | {{wisMod}} | {{wisSave}} |
| Charisma | {{charisma}} | {{chaMod}} | {{chaSave}} |

## Skills & Proficiencies
**Proficiency Bonus:** +{{profBonus}}  
**Skills:** {{skills}}  
**Languages:** {{languages}}  
**Other Proficiencies:** {{proficiencies}}

## Combat Stats
- **Armor Class:** {{ac}}
- **Hit Points:** {{maxHP}} ({{currentHP}} current)
- **Initiative:** {{dexMod}}
- **Spell Save DC:** {{spellSaveDC}}
- **Spell Attack Bonus:** {{spellAttackBonus}}

## Equipment & Inventory
{{equipment}}

## Spells
{{spells}}

### Spell Slots
{{spellSlots}}

## Features & Traits
{{features}}

## Character Background
**Ideals:** {{ideals}}  
**Bonds:** {{bonds}}  
**Flaws:** {{flaws}}  

**Backstory:**  
{{backstory}}

## Notes
{{notes}}

## Character Advancement
### Level {{level}} Features
{{levelFeatures}}

### Next Level ({{nextLevel}})
**XP Needed:** {{xpForNextLevel}}  
**Features Gained:** {{nextLevelFeatures}}
`
}

export default class CharacterManagerPlugin extends Plugin {
    settings: CharacterManagerSettings;
    characters: Character[] = [];

    async onload() {
        await this.loadSettings();

        // Add ribbon icon
        this.addRibbonIcon('users', 'Character Manager', (evt: MouseEvent) => {
            new CharacterListModal(this.app, this).open();
        });

        // Add command to create new D&D character
        this.addCommand({
            id: 'create-new-dnd-character',
            name: 'Create New D&D Character',
            callback: () => {
                new CreateDnDCharacterModal(this.app, this).open();
            }
        });

        // Add command to level up character
        this.addCommand({
            id: 'level-up-character',
            name: 'Level Up Character',
            callback: () => {
                new LevelUpModal(this.app, this).open();
            }
        });

        // Add command to manage equipment
        this.addCommand({
            id: 'manage-equipment',
            name: 'Manage Equipment',
            callback: () => {
                new EquipmentModal(this.app, this).open();
            }
        });

        // Add command to manage spells
        this.addCommand({
            id: 'manage-spells',
            name: 'Manage Spells',
            callback: () => {
                new SpellModal(this.app, this).open();
            }
        });

        // Add command to create basic character
        this.addCommand({
            id: 'create-new-character',
            name: 'Create New Character (Basic)',
            callback: () => {
                new CreateCharacterModal(this.app, this).open();
            }
        });

        // Add command to open character list
        this.addCommand({
            id: 'open-character-list',
            name: 'Open Character List',
            callback: () => {
                new CharacterListModal(this.app, this).open();
            }
        });

        // Add settings tab
        this.addSettingTab(new CharacterManagerSettingTab(this.app, this));

        // Load existing characters
        await this.loadCharacters();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async loadCharacters() {
        const folder = this.app.vault.getAbstractFileByPath(this.settings.charactersFolder);
        if (!folder) {
            await this.app.vault.createFolder(this.settings.charactersFolder);
            return;
        }

        this.characters = [];
        const files = this.app.vault.getMarkdownFiles();
        
        for (const file of files) {
            if (file.path.startsWith(this.settings.charactersFolder + '/')) {
                this.characters.push({
                    name: file.basename,
                    file: file,
                    lastModified: file.stat.mtime
                });
            }
        }

        // Sort by last modified
        this.characters.sort((a, b) => b.lastModified - a.lastModified);
    }

    calculateAbilityModifier(score: number): number {
        return Math.floor((score - 10) / 2);
    }

    calculateProficiencyBonus(level: number): number {
        return Math.ceil(level / 4) + 1;
    }

    calculateHitPoints(level: number, hitDie: number, conModifier: number): number {
        return hitDie + conModifier + (level - 1) * (Math.floor(hitDie / 2) + 1 + conModifier);
    }

    calculateSpellSaveDC(level: number, spellcastingAbility: string, abilityModifier: number): number {
        return 8 + this.calculateProficiencyBonus(level) + abilityModifier;
    }

    calculateSpellAttackBonus(level: number, abilityModifier: number): number {
        return this.calculateProficiencyBonus(level) + abilityModifier;
    }

    getExperienceForLevel(level: number): number {
        return DND_DATA.experienceTable[level] || 0;
    }

    getNextLevelExperience(level: number): number {
        return DND_DATA.experienceTable[level + 1] || DND_DATA.experienceTable[20];
    }

    formatSpellSlots(classData: any, level: number): string {
        if (!classData.spellcaster || !classData.spellSlots[level]) {
            return "None";
        }

        const slots = classData.spellSlots[level];
        let slotsText = "";
        for (let i = 0; i < slots.length; i++) {
            const spellLevel = i + 1;
            slotsText += `**${spellLevel}${this.getOrdinalSuffix(spellLevel)} Level:** ${slots[i]} slots\n`;
        }
        return slotsText.trim();
    }

    getOrdinalSuffix(num: number): string {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = num % 100;
        return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    }

    formatEquipmentList(equipment: string[]): string {
        if (!equipment || equipment.length === 0) {
            return "Starting equipment based on class and background";
        }
        
        let equipmentText = "## Weapons\n";
        const weapons = equipment.filter(item => DND_DATA.equipment.weapons[item]);
        weapons.forEach(weapon => {
            const weaponData = DND_DATA.equipment.weapons[weapon];
            equipmentText += `- **${weapon}**: ${weaponData.damage} ${weaponData.damageType} damage\n`;
        });

        equipmentText += "\n## Armor\n";
        const armor = equipment.filter(item => DND_DATA.equipment.armor[item]);
        armor.forEach(armorItem => {
            const armorData = DND_DATA.equipment.armor[armorItem];
            equipmentText += `- **${armorItem}**: AC ${armorData.ac}\n`;
        });

        equipmentText += "\n## Adventuring Gear\n";
        const gear = equipment.filter(item => DND_DATA.equipment.adventuringGear[item]);
        gear.forEach(gearItem => {
            equipmentText += `- ${gearItem}\n`;
        });

        return equipmentText;
    }

    formatSpellList(spells: string[]): string {
        if (!spells || spells.length === 0) {
            return "None";
        }

        let spellText = "";
        for (let level = 0; level <= 9; level++) {
            const spellsOfLevel = spells.filter(spell => {
                return Object.keys(DND_DATA.spells[level] || {}).includes(spell);
            });

            if (spellsOfLevel.length > 0) {
                const levelName = level === 0 ? "Cantrips" : `${level}${this.getOrdinalSuffix(level)} Level`;
                spellText += `\n### ${levelName}\n`;
                spellsOfLevel.forEach(spell => {
                    const spellData = DND_DATA.spells[level][spell];
                    spellText += `- **${spell}** (${spellData.school}): ${spellData.castingTime}, ${spellData.range}\n`;
                });
            }
        }

        return spellText || "None";
    }

    async createDnDCharacter(characterData: DnDCharacterData) {
        const fileName = `${this.settings.charactersFolder}/${characterData.name}.md`;
        
        // Calculate derived stats
        const modifiers = {
            strength: this.calculateAbilityModifier(characterData.stats.strength),
            dexterity: this.calculateAbilityModifier(characterData.stats.dexterity),
            constitution: this.calculateAbilityModifier(characterData.stats.constitution),
            intelligence: this.calculateAbilityModifier(characterData.stats.intelligence),
            wisdom: this.calculateAbilityModifier(characterData.stats.wisdom),
            charisma: this.calculateAbilityModifier(characterData.stats.charisma)
        };

        const classData = DND_DATA.classes[characterData.class];
        const profBonus = this.calculateProficiencyBonus(characterData.level);
        const maxHP = this.calculateHitPoints(characterData.level, classData.hitDie, modifiers.constitution);
        const ac = 10 + modifiers.dexterity; // Base AC, will be modified by armor
        const experience = this.getExperienceForLevel(characterData.level);
        const nextLevelXP = this.getNextLevelExperience(characterData.level);

        // Calculate spell save DC and attack bonus if spellcaster
        let spellSaveDC = 8;
        let spellAttackBonus = 0;
        if (classData.spellcaster) {
            const spellcastingMod = modifiers[classData.spellcastingAbility.toLowerCase()];
            spellSaveDC = this.calculateSpellSaveDC(characterData.level, classData.spellcastingAbility, spellcastingMod);
            spellAttackBonus = this.calculateSpellAttackBonus(characterData.level, spellcastingMod);
        }

        // Calculate saving throws
        const savingThrows: { [key: string]: string } = {};
        Object.keys(modifiers).forEach(ability => {
            const abilityName = ability.charAt(0).toUpperCase() + ability.slice(1);
            const isProficient = classData.savingThrows.includes(abilityName);
            const bonus = modifiers[ability] + (isProficient ? profBonus : 0);
            savingThrows[ability] = bonus >= 0 ? `+${bonus}` : `${bonus}`;
        });

        // Format subclass display
        const subclassDisplay = characterData.subclass 
            ? `*Level ${characterData.level} ${characterData.race} ${characterData.class} (${characterData.subclass})*`
            : `*Level ${characterData.level} ${characterData.race} ${characterData.class}*`;

        // Build template replacement object
        const templateData = {
            name: characterData.name,
            class: characterData.class,
            subclass: characterData.subclass || "None",
            race: characterData.race,
            subrace: characterData.subrace || "None",
            background: characterData.background,
            level: characterData.level,
            experience: experience,
            multiclass: JSON.stringify(characterData.multiclass),
            alignment: characterData.alignment,
            strength: characterData.stats.strength,
            dexterity: characterData.stats.dexterity,
            constitution: characterData.stats.constitution,
            intelligence: characterData.stats.intelligence,
            wisdom: characterData.stats.wisdom,
            charisma: characterData.stats.charisma,
            strMod: modifiers.strength >= 0 ? `+${modifiers.strength}` : `${modifiers.strength}`,
            dexMod: modifiers.dexterity >= 0 ? `+${modifiers.dexterity}` : `${modifiers.dexterity}`,
            conMod: modifiers.constitution >= 0 ? `+${modifiers.constitution}` : `${modifiers.constitution}`,
            intMod: modifiers.intelligence >= 0 ? `+${modifiers.intelligence}` : `${modifiers.intelligence}`,
            wisMod: modifiers.wisdom >= 0 ? `+${modifiers.wisdom}` : `${modifiers.wisdom}`,
            chaMod: modifiers.charisma >= 0 ? `+${modifiers.charisma}` : `${modifiers.charisma}`,
            strSave: savingThrows.strength,
            dexSave: savingThrows.dexterity,
            conSave: savingThrows.constitution,
            intSave: savingThrows.intelligence,
            wisSave: savingThrows.wisdom,
            chaSave: savingThrows.charisma,
            maxHP: maxHP,
            currentHP: maxHP,
            ac: ac,
            profBonus: profBonus,
            savingThrows: classData.savingThrows.join(", "),
            skills: "To be determined",
            languages: "Common",
            proficiencies: "To be determined",
            equipment: this.formatEquipmentList(characterData.selectedEquipment),
            spells: this.formatSpellList(characterData.selectedSpells),
            spellSlots: this.formatSpellSlots(classData, characterData.level),
            spellSaveDC: spellSaveDC,
            spellAttackBonus: spellAttackBonus >= 0 ? `+${spellAttackBonus}` : `${spellAttackBonus}`,
            features: "Class and racial features",
            backstory: characterData.backstory,
            ideals: characterData.ideals,
            bonds: characterData.bonds,
            flaws: characterData.flaws,
            notes: "Additional character notes",
            subclassDisplay: subclassDisplay,
            nextLevel: characterData.level + 1,
            xpForNextLevel: nextLevelXP - experience,
            levelFeatures: `Features gained at level ${characterData.level}`,
            nextLevelFeatures: `Features gained at level ${characterData.level + 1}`
        };

        // Replace template placeholders
        let content = this.settings.defaultTemplate;
        for (const [key, value] of Object.entries(templateData)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, String(value));
        }
        
        try {
            const file = await this.app.vault.create(fileName, content);
            await this.loadCharacters();
            
            // Open the new character file
            await this.app.workspace.getLeaf().openFile(file);
            
            new Notice(`D&D Character "${characterData.name}" created successfully!`);
            return file;
        } catch (error) {
            new Notice(`Error creating character: ${error.message}`);
            return null;
        }
    }

    async createCharacter(name: string) {
        const fileName = `${this.settings.charactersFolder}/${name}.md`;
        const content = `# ${name}\n\nBasic character template for non-D&D characters.`;
        
        try {
            const file = await this.app.vault.create(fileName, content);
            await this.loadCharacters();
            
            // Open the new character file
            await this.app.workspace.getLeaf().openFile(file);
            
            new Notice(`Character "${name}" created successfully!`);
            return file;
        } catch (error) {
            new Notice(`Error creating character: ${error.message}`);
            return null;
        }
    }

    async deleteCharacter(character: Character) {
        try {
            await this.app.vault.delete(character.file);
            await this.loadCharacters();
            new Notice(`Character "${character.name}" deleted.`);
        } catch (error) {
            new Notice(`Error deleting character: ${error.message}`);
        }
    }
}