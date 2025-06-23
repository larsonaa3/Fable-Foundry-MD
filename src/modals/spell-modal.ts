import { App, Modal, DropdownComponent } from 'obsidian';
import CharacterManagerPlugin from '../../main';
import { DND_DATA } from '../dnd-data';

interface SpellData {
    school: string;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    classes: string[];
}

export class SpellModal extends Modal {
    plugin: CharacterManagerPlugin;
    currentLevel: number = 0;
    spellDisplay: HTMLElement;

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
            .spell-modal {
                max-width: 1000px;
                max-height: 85vh;
                overflow-y: auto;
            }
            .spell-filters {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                padding: 15px;
                background-color: var(--background-secondary);
                border-radius: 6px;
                flex-wrap: wrap;
                align-items: end;
            }
            .filter-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .filter-group label {
                font-size: 0.9em;
                font-weight: 500;
            }
            .tab-container {
                display: flex;
                gap: 5px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--background-modifier-border);
                flex-wrap: wrap;
            }
            .tab-button {
                padding: 8px 16px;
                border: none;
                background: none;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
                font-size: 0.9em;
            }
            .tab-button:hover {
                background-color: var(--background-modifier-hover);
            }
            .tab-button.active {
                border-bottom-color: var(--interactive-accent);
                background-color: var(--background-modifier-hover);
            }
            .spell-table {
                width: 100%;
                border-collapse: collapse;
            }
            .spell-table th,
            .spell-table td {
                border: 1px solid var(--background-modifier-border);
                padding: 8px 12px;
                text-align: left;
                vertical-align: top;
            }
            .spell-table th {
                background-color: var(--background-secondary);
                font-weight: 600;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .spell-table tr:hover {
                background-color: var(--background-modifier-hover);
            }
            .spell-display {
                max-height: 500px;
                overflow-y: auto;
                border: 1px solid var(--background-modifier-border);
                border-radius: 6px;
            }
            .spell-name {
                font-weight: 600;
                color: var(--text-accent);
            }
            .spell-school {
                font-size: 0.85em;
                color: var(--text-muted);
                font-style: italic;
            }
            .spell-classes {
                font-size: 0.85em;
                word-wrap: break-word;
            }
            .search-box {
                flex: 1;
                min-width: 200px;
                padding: 8px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-primary);
            }
            .class-filter {
                min-width: 120px;
            }
        `;

        contentEl.addClass('spell-modal');
        contentEl.createEl('h2', { text: 'Spell Database' });

        // Filters section
        const filtersSection = contentEl.createDiv('spell-filters');
        
        // Search box
        const searchGroup = filtersSection.createDiv('filter-group');
        searchGroup.createEl('label', { text: 'Search Spells:' });
        const searchBox = searchGroup.createEl('input', { 
            type: 'text', 
            placeholder: 'Search by spell name...',
            cls: 'search-box'
        });

        // Class filter
        const classGroup = filtersSection.createDiv('filter-group');
        classGroup.createEl('label', { text: 'Filter by Class:' });
        const classFilter = new DropdownComponent(classGroup);
        classFilter.selectEl.addClass('class-filter');
        classFilter.addOption('', 'All Classes');
        
        // Get all unique classes from spell data
        const allClasses = new Set<string>();
        Object.values(DND_DATA.spells).forEach(spellLevel => {
            Object.values(spellLevel).forEach((spell: SpellData) => {
                spell.classes.forEach(cls => allClasses.add(cls));
            });
        });
        
        Array.from(allClasses).sort().forEach(className => {
            classFilter.addOption(className, className);
        });

        // Search functionality
        let searchTimeout: NodeJS.Timeout;
        const performSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.displaySpells(this.currentLevel, searchBox.value, classFilter.getValue());
            }, 300);
        };

        searchBox.addEventListener('input', performSearch);
        classFilter.onChange(() => {
            this.displaySpells(this.currentLevel, searchBox.value, classFilter.getValue());
        });

        // Spell level tabs
        const tabContainer = contentEl.createDiv('tab-container');
        const spellDisplay = contentEl.createDiv('spell-display');

        // Store display element for updates
        this.spellDisplay = spellDisplay;

        // Create tabs for each spell level
        const tabs: HTMLElement[] = [];
        for (let level = 0; level <= 1; level++) {
            const tab = tabContainer.createEl('button', { cls: 'tab-button' });
            tab.textContent = level === 0 ? 'Cantrips (0)' : `Level ${level}`;
            
            if (level === 0) {
                tab.addClass('active');
            }
            
            tab.onclick = () => {
                tabs.forEach(t => t.removeClass('active'));
                tab.addClass('active');
                this.currentLevel = level;
                this.displaySpells(level, searchBox.value, classFilter.getValue());
            };
            
            tabs.push(tab);
        }

        // Add info section
        const infoSection = contentEl.createDiv();
        infoSection.style.marginTop = '20px';
        infoSection.style.padding = '15px';
        infoSection.style.backgroundColor = 'var(--background-secondary)';
        infoSection.style.borderRadius = '6px';
        infoSection.style.fontSize = '0.9em';

        infoSection.createEl('h4', { text: '📚 Spell Database Info' });
        const infoList = infoSection.createEl('ul');
        infoList.createEl('li', { text: 'Currently includes Cantrips and 1st Level spells from D&D 5e (2014)' });
        infoList.createEl('li', { text: 'Filter by class to see spells available to specific character types' });
        infoList.createEl('li', { text: 'Search by spell name to quickly find specific spells' });
        infoList.createEl('li', { text: 'More spell levels can be added in future updates' });

        // Default to cantrips
        this.displaySpells(0);
    }

    displaySpells(level: number, searchTerm: string = '', classFilter: string = '') {
        this.spellDisplay.empty();
        
        if (!DND_DATA.spells[level]) {
            this.spellDisplay.createEl('p', { 
                text: 'No spells available for this level.',
                attr: { style: 'text-align: center; padding: 40px; color: var(--text-muted); font-style: italic;' }
            });
            return;
        }

        const table = this.spellDisplay.createEl('table', { cls: 'spell-table' });

        // Header
        const header = table.createEl('thead');
        const headerRow = header.createEl('tr');
        ['Spell', 'School', 'Casting Time', 'Range', 'Components', 'Duration', 'Classes'].forEach(text => {
            headerRow.createEl('th', { text });
        });

        // Body
        const tbody = table.createEl('tbody');
        let spells = Object.entries(DND_DATA.spells[level]);
        
        // Apply filters
        if (searchTerm) {
            spells = spells.filter(([name]) => 
                name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (classFilter) {
            spells = spells.filter(([_, spell]) => {
                const spellData = spell as SpellData;
                return spellData.classes.includes(classFilter);
            });
        }

        if (spells.length === 0) {
            const noResults = tbody.createEl('tr');
            const cell = noResults.createEl('td', { 
                text: searchTerm || classFilter ? 
                    'No spells found matching your filters.' : 
                    'No spells available for this level.'
            });
            cell.colSpan = 7;
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.color = 'var(--text-muted)';
            cell.style.padding = '20px';
            return;
        }

        spells.forEach(([name, data]) => {
            const spellData = data as SpellData;
            const row = tbody.createEl('tr');
            
            // Spell name with school
            const nameCell = row.createEl('td');
            nameCell.createDiv({ cls: 'spell-name', text: name });
            nameCell.createDiv({ cls: 'spell-school', text: spellData.school });
            
            row.createEl('td', { text: spellData.school });
            row.createEl('td', { text: spellData.castingTime });
            row.createEl('td', { text: spellData.range });
            row.createEl('td', { text: spellData.components });
            row.createEl('td', { text: spellData.duration });
            
            const classesCell = row.createEl('td', { cls: 'spell-classes' });
            classesCell.textContent = spellData.classes.join(', ');
            
            // Highlight matching classes if filter is active
            if (classFilter) {
                const highlightedText = classesCell.textContent.replace(
                    new RegExp(`\\b${classFilter}\\b`, 'gi'),
                    `<strong style="color: var(--text-accent);">$&</strong>`
                );
                classesCell.innerHTML = highlightedText;
            }
        });

        // Add spell count info
        const countInfo = this.spellDisplay.createDiv();
        countInfo.style.padding = '10px';
        countInfo.style.textAlign = 'center';
        countInfo.style.fontSize = '0.9em';
        countInfo.style.color = 'var(--text-muted)';
        countInfo.style.borderTop = '1px solid var(--background-modifier-border)';
        
        const levelName = level === 0 ? 'Cantrips' : `Level ${level} Spells`;
        const filterInfo = (searchTerm || classFilter) ? ' (filtered)' : '';
        countInfo.textContent = `Showing ${spells.length} ${levelName}${filterInfo}`;
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}