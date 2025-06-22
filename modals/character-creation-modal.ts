import { App, Modal, TextComponent, TextAreaComponent, DropdownComponent, Notice } from 'obsidian';
import { DND_DATA, DnDCharacterData } from '../dnd-data';
import CharacterManagerPlugin from '../main';

export class CreateDnDCharacterModal extends Modal {
    plugin: CharacterManagerPlugin;
    characterData: DnDCharacterData;
    
    // Form elements
    nameInput: TextComponent;
    classDropdown: DropdownComponent;
    subclassDropdown: DropdownComponent;
    levelInput: TextComponent;
    raceDropdown: DropdownComponent;
    subraceDropdown: DropdownComponent;
    backgroundDropdown: DropdownComponent;
    alignmentDropdown: DropdownComponent;
    
    // Ability score inputs
    strInput: TextComponent;
    dexInput: TextComponent;
    conInput: TextComponent;
    intInput: TextComponent;
    wisInput: TextComponent;
    chaInput: TextComponent;
    
    // Background inputs
    backstoryInput: TextAreaComponent;
    idealsInput: TextComponent;
    bondsInput: TextComponent;
    flawsInput: TextComponent;

    // Equipment and spells
    selectedEquipment: string[] = [];
    selectedSpells: string[] = [];

    constructor(app: App, plugin: CharacterManagerPlugin) {
        super(app);
        this.plugin = plugin;
        this.characterData = {
            name: '',
            class: 'Fighter',
            subclass: '',
            level: 1,
            race: 'Human',
            subrace: '',
            background: 'Folk Hero',
            alignment: 'True Neutral',
            multiclass: [],
            stats: {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            },
            backstory: '',
            ideals: '',
            bonds: '',
            flaws: '',
            selectedEquipment: [],
            selectedSpells: []
        };
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('dnd-character-modal');

        // Add custom styles
        const style = contentEl.createEl('style');
        style.textContent = `
            .dnd-character-modal {
                max-width: 900px;
                max-height: 90vh;
                overflow-y: auto;
            }
            .form-section {
                margin-bottom: 20px;
                padding: 15px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 8px;
            }
            .form-section h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: var(--text-accent);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .form-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
                align-items: end;
            }
            .form-group {
                flex: 1;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            .ability-scores {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            .ability-score-group {
                text-align: center;
            }
            .ability-score-group input {
                width: 60px;
                text-align: center;
                font-weight: bold;
            }
            .modifier {
                font-size: 0.9em;
                color: var(--text-muted);
                margin-top: 5px;
            }
            .equipment-grid, .spell-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid var(--background-modifier-border);
                padding: 10px;
                border-radius: 4px;
            }
            .equipment-item, .spell-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px;
            }
            .btn-group {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
        `;

        contentEl.createEl('h2', { text: 'Create New D&D 5e Character' });

        // Basic Information Section
        this.createBasicInfoSection(contentEl);
        
        // Ability Scores Section
        this.createAbilityScoresSection(contentEl);
        
        // Equipment Section
        this.createEquipmentSection(contentEl);
        
        // Spells Section
        this.createSpellsSection(contentEl);
        
        // Character Background Section
        this.createBackgroundSection(contentEl);

        // Buttons
        this.createButtons(contentEl);

        // Set initial values
        this.updateSubclassOptions();
        this.updateSubraceOptions();
        this.updateEquipmentOptions();
        this.updateSpellOptions();
    }

    createBasicInfoSection(contentEl: HTMLElement) {
        const basicSection = contentEl.createDiv('form-section');
        basicSection.createEl('h3', { text: '⚔️ Basic Information' });

        const basicRow1 = basicSection.createDiv('form-row');
        
        const nameGroup = basicRow1.createDiv('form-group');
        nameGroup.createEl('label', { text: 'Character Name:' });
        this.nameInput = new TextComponent(nameGroup);
        this.nameInput.inputEl.placeholder = 'Enter character name...';

        const levelGroup = basicRow1.createDiv('form-group');
        levelGroup.createEl('label', { text: 'Level:' });
        this.levelInput = new TextComponent(levelGroup);
        this.levelInput.setValue('1');
        this.levelInput.inputEl.type = 'number';
        this.levelInput.inputEl.min = '1';
        this.levelInput.inputEl.max = '20';
        this.levelInput.onChange(() => {
            this.updateSpellOptions();
        });

        const basicRow2 = basicSection.createDiv('form-row');

        const classGroup = basicRow2.createDiv('form-group');
        classGroup.createEl('label', { text: 'Class:' });
        this.classDropdown = new DropdownComponent(classGroup);
        Object.keys(DND_DATA.classes).forEach(className => {
            this.classDropdown.addOption(className, className);
        });
        this.classDropdown.onChange((value) => {
            this.characterData.class = value;
            this.updateSubclassOptions();
            this.updateSpellOptions();
        });

        const subclassGroup = basicRow2.createDiv('form-group');
        subclassGroup.createEl('label', { text: 'Subclass:' });
        this.subclassDropdown = new DropdownComponent(subclassGroup);
        this.updateSubclassOptions();

        // Race Section
        const raceSection = contentEl.createDiv('form-section');
        raceSection.createEl('h3', { text: '🧙‍♂️ Race & Background' });

        const raceRow = raceSection.createDiv('form-row');

        const raceGroup = raceRow.createDiv('form-group');
        raceGroup.createEl('label', { text: 'Race:' });
        this.raceDropdown = new DropdownComponent(raceGroup);
        Object.keys(DND_DATA.races).forEach(raceName => {
            this.raceDropdown.addOption(raceName, raceName);
        });
        this.raceDropdown.onChange((value) => {
            this.characterData.race = value;
            this.updateSubraceOptions();
        });

        const subraceGroup = raceRow.createDiv('form-group');
        subraceGroup.createEl('label', { text: 'Subrace:' });
        this.subraceDropdown = new DropdownComponent(subraceGroup);
        this.updateSubraceOptions();

        const backgroundGroup = raceRow.createDiv('form-group');
        backgroundGroup.createEl('label', { text: 'Background:' });
        this.backgroundDropdown = new DropdownComponent(backgroundGroup);
        DND_DATA.backgrounds.forEach(bg => {
            this.backgroundDropdown.addOption(bg, bg);
        });

        const alignmentGroup = raceRow.createDiv('form-group');
        alignmentGroup.createEl('label', { text: 'Alignment:' });
        this.alignmentDropdown = new DropdownComponent(alignmentGroup);
        DND_DATA.alignments.forEach(alignment => {
            this.alignmentDropdown.addOption(alignment, alignment);
        });
    }

    createAbilityScoresSection(contentEl: HTMLElement) {
        const statsSection = contentEl.createDiv('form-section');
        statsSection.createEl('h3', { text: '🎲 Ability Scores' });
        
        const btnGroup = statsSection.createDiv('btn-group');
        
        const rollButton = btnGroup.createEl('button', { text: '🎲 Roll 4d6 Drop Lowest' });
        rollButton.onclick = () => this.rollAbilityScores();

        const pointBuyButton = btnGroup.createEl('button', { text: '📊 Point Buy (27 points)' });
        pointBuyButton.onclick = () => this.setPointBuyScores();

        const arrayButton = btnGroup.createEl('button', { text: '📋 Standard Array' });
        arrayButton.onclick = () => this.setStandardArray();

        const statsGrid = statsSection.createDiv('ability-scores');

        // Create ability score inputs
        this.createAbilityScoreInput(statsGrid, 'Strength', 'strInput');
        this.createAbilityScoreInput(statsGrid, 'Dexterity', 'dexInput');
        this.createAbilityScoreInput(statsGrid, 'Constitution', 'conInput');
        this.createAbilityScoreInput(statsGrid, 'Intelligence', 'intInput');
        this.createAbilityScoreInput(statsGrid, 'Wisdom', 'wisInput');
        this.createAbilityScoreInput(statsGrid, 'Charisma', 'chaInput');
    }

    createEquipmentSection(contentEl: HTMLElement) {
        const equipmentSection = contentEl.createDiv('form-section');
        equipmentSection.createEl('h3', { text: '⚔️ Starting Equipment' });

        const equipmentGrid = equipmentSection.createDiv('equipment-grid');
        equipmentGrid.id = 'equipment-grid';

        const equipmentNote = equipmentSection.createEl('p');
        equipmentNote.style.fontSize = '0.9em';
        equipmentNote.style.color = 'var(--text-muted)';
        equipmentNote.textContent = 'Select starting weapons, armor, and gear. Equipment list updates based on your class.';
    }

    createSpellsSection(contentEl: HTMLElement) {
        const spellsSection = contentEl.createDiv('form-section');
        spellsSection.createEl('h3', { text: '✨ Spells' });

        const spellGrid = spellsSection.createDiv('spell-grid');
        spellGrid.id = 'spell-grid';

        const spellNote = spellsSection.createEl('p');
        spellNote.style.fontSize = '0.9em';
        spellNote.style.color = 'var(--text-muted)';
        spellNote.textContent = 'Select known spells. Available spells depend on your class and level.';
    }

    createBackgroundSection(contentEl: HTMLElement) {
        const backgroundSection = contentEl.createDiv('form-section');
        backgroundSection.createEl('h3', { text: '📖 Character Background' });

        const idealsGroup = backgroundSection.createDiv('form-group');
        idealsGroup.createEl('label', { text: 'Ideals:' });
        this.idealsInput = new TextComponent(idealsGroup);
        this.idealsInput.inputEl.placeholder = 'What drives your character?';

        const bondsGroup = backgroundSection.createDiv('form-group');
        bondsGroup.createEl('label', { text: 'Bonds:' });
        this.bondsInput = new TextComponent(bondsGroup);
        this.bondsInput.inputEl.placeholder = 'What connects your character to the world?';

        const flawsGroup = backgroundSection.createDiv('form-group');
        flawsGroup.createEl('label', { text: 'Flaws:' });
        this.flawsInput = new TextComponent(flawsGroup);
        this.flawsInput.inputEl.placeholder = 'What weakness does your character have?';

        const backstoryGroup = backgroundSection.createDiv('form-group');
        backstoryGroup.createEl('label', { text: 'Backstory:' });
        this.backstoryInput = new TextAreaComponent(backstoryGroup);
        this.backstoryInput.inputEl.placeholder = 'Tell your character\'s story...';
        this.backstoryInput.inputEl.rows = 4;
    }

    createButtons(contentEl: HTMLElement) {
        const buttonContainer = contentEl.createDiv();
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.textAlign = 'right';
        buttonContainer.style.borderTop = '1px solid var(--background-modifier-border)';
        buttonContainer.style.paddingTop = '15px';

        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.style.marginRight = '10px';
        cancelButton.onclick = () => this.close();

        const createButton = buttonContainer.createEl('button', { text: 'Create Character', cls: 'mod-cta' });
        createButton.onclick = () => this.createCharacter();
    }

    createAbilityScoreInput(container: HTMLElement, abilityName: string, inputProperty: string) {
        const group = container.createDiv('ability-score-group');
        group.createEl('label', { text: abilityName });
        
        const input = new TextComponent(group);
        input.setValue('10');
        input.inputEl.type = 'number';
        input.inputEl.min = '1';
        input.inputEl.max = '20';
        
        const modifierEl = group.createDiv('modifier');
        modifierEl.textContent = '+0';
        
        input.onChange((value) => {
            const score = parseInt(value) || 10;
            const modifier = this.plugin.calculateAbilityModifier(score);
            modifierEl.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        });
        
        this[inputProperty] = input;
    }

    updateSubclassOptions() {
        this.subclassDropdown.selectEl.empty();
        this.subclassDropdown.addOption('', 'None (Level 1-2)');
        
        const classData = DND_DATA.classes[this.characterData.class];
        if (classData && classData.subclasses) {
            classData.subclasses.forEach(subclass => {
                this.subclassDropdown.addOption(subclass, subclass);
            });
        }
    }

    updateSubraceOptions() {
        this.subraceDropdown.selectEl.empty();
        this.subraceDropdown.addOption('', 'None');
        
        const raceData = DND_DATA.races[this.characterData.race];
        if (raceData && raceData.subraces && raceData.subraces.length > 0) {
            raceData.subraces.forEach(subrace => {
                this.subraceDropdown.addOption(subrace, subrace);
            });
        }
    }

    updateEquipmentOptions() {
        const equipmentGrid = document.getElementById('equipment-grid');
        if (!equipmentGrid) return;

        equipmentGrid.empty();

        // Add weapons
        const weaponsHeader = equipmentGrid.createEl('h4', { text: 'Weapons' });
        weaponsHeader.style.gridColumn = '1 / -1';
        
        Object.keys(DND_DATA.equipment.weapons).forEach(weapon => {
            const item = equipmentGrid.createDiv('equipment-item');
            const checkbox = item.createEl('input');
            checkbox.type = 'checkbox';
            checkbox.id = `weapon-${weapon}`;
            checkbox.onchange = () => this.toggleEquipment(weapon, checkbox.checked);
            
            const label = item.createEl('label');
            label.setAttribute('for', `weapon-${weapon}`);
            label.textContent = weapon;
        });

        // Add armor
        const armorHeader = equipmentGrid.createEl('h4', { text: 'Armor' });
        armorHeader.style.gridColumn = '1 / -1';
        
        Object.keys(DND_DATA.equipment.armor).forEach(armor => {
            const item = equipmentGrid.createDiv('equipment-item');
            const checkbox = item.createEl('input');
            checkbox.type = 'checkbox';
            checkbox.id = `armor-${armor}`;
            checkbox.onchange = () => this.toggleEquipment(armor, checkbox.checked);
            
            const label = item.createEl('label');
            label.setAttribute('for', `armor-${armor}`);
            label.textContent = armor;
        });

        // Add adventuring gear
        const gearHeader = equipmentGrid.createEl('h4', { text: 'Adventuring Gear' });
        gearHeader.style.gridColumn = '1 / -1';
        
        Object.keys(DND_DATA.equipment.adventuringGear).slice(0, 15).forEach(gear => {
            const item = equipmentGrid.createDiv('equipment-item');
            const checkbox = item.createEl('input');
            checkbox.type = 'checkbox';
            checkbox.id = `gear-${gear}`;
            checkbox.onchange = () => this.toggleEquipment(gear, checkbox.checked);
            
            const label = item.createEl('label');
            label.setAttribute('for', `gear-${gear}`);
            label.textContent = gear;
        });
    }

    updateSpellOptions() {
        const spellGrid = document.getElementById('spell-grid');
        if (!spellGrid) return;

        spellGrid.empty();

        const currentClass = this.classDropdown.getValue();
        const currentLevel = parseInt(this.levelInput.getValue()) || 1;
        const classData = DND_DATA.classes[currentClass];

        if (!classData || !classData.spellcaster) {
            spellGrid.createEl('p', { text: 'This class does not cast spells.' });
            return;
        }

        // Add cantrips (level 0)
        if (DND_DATA.spells[0]) {
            const cantripsHeader = spellGrid.createEl('h4', { text: 'Cantrips' });
            cantripsHeader.style.gridColumn = '1 / -1';
            
            Object.keys(DND_DATA.spells[0]).forEach(spell => {
                const spellData = DND_DATA.spells[0][spell];
                if (spellData.classes.includes(currentClass)) {
                    const item = spellGrid.createDiv('spell-item');
                    const checkbox = item.createEl('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `spell-${spell}`;
                    checkbox.onchange = () => this.toggleSpell(spell, checkbox.checked);
                    
                    const label = item.createEl('label');
                    label.setAttribute('for', `spell-${spell}`);
                    label.textContent = spell;
                }
            });
        }

        // Add 1st level spells
        if (DND_DATA.spells[1] && currentLevel >= 1) {
            const firstLevelHeader = spellGrid.createEl('h4', { text: '1st Level Spells' });
            firstLevelHeader.style.gridColumn = '1 / -1';
            
            Object.keys(DND_DATA.spells[1]).forEach(spell => {
                const spellData = DND_DATA.spells[1][spell];
                if (spellData.classes.includes(currentClass)) {
                    const item = spellGrid.createDiv('spell-item');
                    const checkbox = item.createEl('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `spell-${spell}`;
                    checkbox.onchange = () => this.toggleSpell(spell, checkbox.checked);
                    
                    const label = item.createEl('label');
                    label.setAttribute('for', `spell-${spell}`);
                    label.textContent = spell;
                }
            });
        }
    }

    toggleEquipment(equipment: string, isSelected: boolean) {
        if (isSelected) {
            if (!this.selectedEquipment.includes(equipment)) {
                this.selectedEquipment.push(equipment);
            }
        } else {
            this.selectedEquipment = this.selectedEquipment.filter(item => item !== equipment);
        }
    }

    toggleSpell(spell: string, isSelected: boolean) {
        if (isSelected) {
            if (!this.selectedSpells.includes(spell)) {
                this.selectedSpells.push(spell);
            }
        } else {
            this.selectedSpells = this.selectedSpells.filter(item => item !== spell);
        }
    }

    rollAbilityScores() {
        const rollStat = () => {
            // Roll 4d6, drop lowest
            const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => b - a);
            return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
        };

        this.strInput.setValue(rollStat().toString());
        this.dexInput.setValue(rollStat().toString());
        this.conInput.setValue(rollStat().toString());
        this.intInput.setValue(rollStat().toString());
        this.wisInput.setValue(rollStat().toString());
        this.chaInput.setValue(rollStat().toString());

        // Trigger modifier updates
        [this.strInput, this.dexInput, this.conInput, this.intInput, this.wisInput, this.chaInput].forEach(input => {
            input.onChanged();
        });

        new Notice('Ability scores rolled!');
    }

    setPointBuyScores() {
        // Standard point buy array (15, 14, 13, 12, 10, 8)
        this.strInput.setValue('15');
        this.dexInput.setValue('14');
        this.conInput.setValue('13');
        this.intInput.setValue('12');
        this.wisInput.setValue('10');
        this.chaInput.setValue('8');

        // Trigger modifier updates
        [this.strInput, this.dexInput, this.conInput, this.intInput, this.wisInput, this.chaInput].forEach(input => {
            input.onChanged();
        });

        new Notice('Point buy scores set! Arrange as desired.');
    }

    setStandardArray() {
        // Standard array (15, 14, 13, 12, 10, 8)
        this.strInput.setValue('15');
        this.dexInput.setValue('14');
        this.conInput.setValue('13');
        this.intInput.setValue('12');
        this.wisInput.setValue('10');
        this.chaInput.setValue('8');

        // Trigger modifier updates
        [this.strInput, this.dexInput, this.conInput, this.intInput, this.wisInput, this.chaInput].forEach(input => {
            input.onChanged();
        });

        new Notice('Standard array applied! Arrange as desired.');
    }

    async createCharacter() {
        const name = this.nameInput.getValue().trim();
        if (!name) {
            new Notice('Please enter a character name.');
            return;
        }

        // Check if character already exists
        const existingFile = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.charactersFolder}/${name}.md`);
        if (existingFile) {
            new Notice('A character with this name already exists.');
            return;
        }

        // Gather all form data
        this.characterData.name = name;
        this.characterData.class = this.classDropdown.getValue();
        this.characterData.subclass = this.subclassDropdown.getValue();
        this.characterData.level = parseInt(this.levelInput.getValue()) || 1;
        this.characterData.race = this.raceDropdown.getValue();
        this.characterData.subrace = this.subraceDropdown.getValue();
        this.characterData.background = this.backgroundDropdown.getValue();
        this.characterData.alignment = this.alignmentDropdown.getValue();

        this.characterData.stats = {
            strength: parseInt(this.strInput.getValue()) || 10,
            dexterity: parseInt(this.dexInput.getValue()) || 10,
            constitution: parseInt(this.conInput.getValue()) || 10,
            intelligence: parseInt(this.intInput.getValue()) || 10,
            wisdom: parseInt(this.wisInput.getValue()) || 10,
            charisma: parseInt(this.chaInput.getValue()) || 10
        };

        this.characterData.backstory = this.backstoryInput.getValue();
        this.characterData.ideals = this.idealsInput.getValue();
        this.characterData.bonds = this.bondsInput.getValue();
        this.characterData.flaws = this.flawsInput.getValue();
        this.characterData.selectedEquipment = this.selectedEquipment;
        this.characterData.selectedSpells = this.selectedSpells;

        await this.plugin.createDnDCharacter(this.characterData);
        this.close();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}