import { App, Modal, DropdownComponent } from 'obsidian';
import CharacterManagerPlugin from '../../main';
import { DND_DATA, Character } from '../dnd-data';

export class EquipmentModal extends Modal {
    plugin: CharacterManagerPlugin;
    selectedCharacter: Character | null = null;
    currentTab: string = 'weapons';

    constructor(app: App, plugin: CharacterManagerPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // Add custom styles
        const style = contentEl.createEl('style');
        style.textContent = `
            .equipment-modal {
                max-width: 900px;
                max-height: 85vh;
                overflow-y: auto;
            }
            .tab-container {
                display: flex;
                gap: 5px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--background-modifier-border);
            }
            .tab-button {
                padding: 10px 20px;
                border: none;
                background: none;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }
            .tab-button:hover {
                background-color: var(--background-modifier-hover);
            }
            .tab-button.active {
                border-bottom-color: var(--interactive-accent);
                background-color: var(--background-modifier-hover);
            }
            .equipment-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            .equipment-table th,
            .equipment-table td {
                border: 1px solid var(--background-modifier-border);
                padding: 8px 12px;
                text-align: left;
            }
            .equipment-table th {
                background-color: var(--background-secondary);
                font-weight: 600;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .equipment-table tr:hover {
                background-color: var(--background-modifier-hover);
            }
            .equipment-display {
                max-height: 500px;
                overflow-y: auto;
                border: 1px solid var(--background-modifier-border);
                border-radius: 6px;
            }
            .character-selector {
                margin-bottom: 20px;
                padding: 15px;
                background-color: var(--background-secondary);
                border-radius: 6px;
            }
            .search-box {
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-primary);
            }
        `;

        contentEl.addClass('equipment-modal');
        contentEl.createEl('h2', { text: 'Equipment Database' });

        // Character selector if multiple characters exist
        if (this.plugin.characters.length > 0) {
            const characterSection = contentEl.createDiv('character-selector');
            characterSection.createEl('h3', { text: 'Character Selection' });
            characterSection.createEl('label', { text: 'Select Character (optional):' });
            const characterDropdown = new DropdownComponent(characterSection);
            characterDropdown.addOption('', 'Browse All Equipment');
            this.plugin.characters.forEach(char => {
                characterDropdown.addOption(char.name, char.name);
            });

            characterDropdown.onChange((value) => {
                this.selectedCharacter = value ? 
                    this.plugin.characters.find(char => char.name === value) || null : 
                    null;
                this.displayCurrentTab();
            });
        }

        // Search box
        const searchBox = contentEl.createEl('input', { 
            type: 'text', 
            placeholder: 'Search equipment...',
            cls: 'search-box'
        });

        let searchTimeout: NodeJS.Timeout;
        searchBox.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.displayCurrentTab((e.target as HTMLInputElement).value);
            }, 300);
        });

        // Equipment tabs
        const tabContainer = contentEl.createDiv('tab-container');

        const weaponsTab = tabContainer.createEl('button', { text: '⚔️ Weapons', cls: 'tab-button active' });
        const armorTab = tabContainer.createEl('button', { text: '🛡️ Armor', cls: 'tab-button' });
        const gearTab = tabContainer.createEl('button', { text: '🎒 Adventuring Gear', cls: 'tab-button' });

        const equipmentDisplay = contentEl.createDiv('equipment-display');

        // Tab click handlers
        weaponsTab.onclick = () => this.setActiveTab('weapons', weaponsTab, [weaponsTab, armorTab, gearTab]);
        armorTab.onclick = () => this.setActiveTab('armor', armorTab, [weaponsTab, armorTab, gearTab]);
        gearTab.onclick = () => this.setActiveTab('gear', gearTab, [weaponsTab, armorTab, gearTab]);

        // Store display element for updates
        this.equipmentDisplay = equipmentDisplay;

        // Default to weapons
        this.displayWeapons();
    }

    private equipmentDisplay: HTMLElement;

    setActiveTab(tab: string, activeButton: HTMLElement, allButtons: HTMLElement[]) {
        // Update button states
        allButtons.forEach(btn => btn.removeClass('active'));
        activeButton.addClass('active');
        
        this.currentTab = tab;
        this.displayCurrentTab();
    }

    displayCurrentTab(searchTerm: string = '') {
        switch (this.currentTab) {
            case 'weapons':
                this.displayWeapons(searchTerm);
                break;
            case 'armor':
                this.displayArmor(searchTerm);
                break;
            case 'gear':
                this.displayGear(searchTerm);
                break;
        }
    }

    displayWeapons(searchTerm: string = '') {
        this.equipmentDisplay.empty();
        
        const table = this.equipmentDisplay.createEl('table', { cls: 'equipment-table' });

        // Header
        const header = table.createEl('thead');
        const headerRow = header.createEl('tr');
        ['Name', 'Damage', 'Type', 'Cost', 'Weight', 'Properties'].forEach(text => {
            headerRow.createEl('th', { text });
        });

        // Body
        const tbody = table.createEl('tbody');
        const weapons = Object.entries(DND_DATA.equipment.weapons);
        
        const filteredWeapons = searchTerm ? 
            weapons.filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase())) :
            weapons;

        if (filteredWeapons.length === 0) {
            const noResults = tbody.createEl('tr');
            const cell = noResults.createEl('td', { text: 'No weapons found matching your search.' });
            cell.colSpan = 6;
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.color = 'var(--text-muted)';
            return;
        }

        filteredWeapons.forEach(([name, data]) => {
            const row = tbody.createEl('tr');
            
            row.createEl('td', { text: name, attr: { style: 'font-weight: 600;' } });
            row.createEl('td', { text: data.damage });
            row.createEl('td', { text: data.damageType });
            row.createEl('td', { text: data.cost });
            row.createEl('td', { text: `${data.weight} lb` });
            row.createEl('td', { text: data.properties.join(', ') });
        });
    }

    displayArmor(searchTerm: string = '') {
        this.equipmentDisplay.empty();
        
        const table = this.equipmentDisplay.createEl('table', { cls: 'equipment-table' });

        // Header
        const header = table.createEl('thead');
        const headerRow = header.createEl('tr');
        ['Name', 'AC', 'Type', 'Cost', 'Weight', 'Stealth'].forEach(text => {
            headerRow.createEl('th', { text });
        });

        // Body
        const tbody = table.createEl('tbody');
        const armor = Object.entries(DND_DATA.equipment.armor);
        
        const filteredArmor = searchTerm ? 
            armor.filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase())) :
            armor;

        if (filteredArmor.length === 0) {
            const noResults = tbody.createEl('tr');
            const cell = noResults.createEl('td', { text: 'No armor found matching your search.' });
            cell.colSpan = 6;
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.color = 'var(--text-muted)';
            return;
        }

        filteredArmor.forEach(([name, data]) => {
            const row = tbody.createEl('tr');
            
            row.createEl('td', { text: name, attr: { style: 'font-weight: 600;' } });
            row.createEl('td', { text: data.ac.toString() });
            row.createEl('td', { text: data.type });
            row.createEl('td', { text: data.cost });
            row.createEl('td', { text: `${data.weight} lb` });
            
            const stealthCell = row.createEl('td');
            if (data.stealthDisadvantage) {
                stealthCell.textContent = 'Disadvantage';
                stealthCell.style.color = 'var(--text-error)';
            } else {
                stealthCell.textContent = 'Normal';
                stealthCell.style.color = 'var(--text-success)';
            }
        });
    }

    displayGear(searchTerm: string = '') {
        this.equipmentDisplay.empty();
        
        const table = this.equipmentDisplay.createEl('table', { cls: 'equipment-table' });

        // Header
        const header = table.createEl('thead');
        const headerRow = header.createEl('tr');
        ['Name', 'Cost', 'Weight'].forEach(text => {
            headerRow.createEl('th', { text });
        });

        // Body
        const tbody = table.createEl('tbody');
        const gear = Object.entries(DND_DATA.equipment.adventuringGear);
        
        const filteredGear = searchTerm ? 
            gear.filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase())) :
            gear;

        if (filteredGear.length === 0) {
            const noResults = tbody.createEl('tr');
            const cell = noResults.createEl('td', { text: 'No gear found matching your search.' });
            cell.colSpan = 3;
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.color = 'var(--text-muted)';
            return;
        }

        filteredGear.forEach(([name, data]) => {
            const row = tbody.createEl('tr');
            
            row.createEl('td', { text: name, attr: { style: 'font-weight: 600;' } });
            row.createEl('td', { text: data.cost });
            row.createEl('td', { text: `${data.weight} lb` });
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}