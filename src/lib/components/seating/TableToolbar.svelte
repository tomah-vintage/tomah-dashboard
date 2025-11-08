<script lang="ts">
    import Button from '$lib/components/ui/button/Button.svelte';
    import { Plus, Trash2, Filter, Grid3x3, Users, BarChart3 } from '@lucide/svelte';
    import { createEventDispatcher } from 'svelte';
    import type { SeatingTable } from '$lib/types/seating';
    
    export let tables: SeatingTable[] = [];
    
    const dispatch = createEventDispatcher();
    let selectedTables: Set<string> = new Set();
    let filterStatus = 'all';
    let showBulkActions = false;

    $: showBulkActions = selectedTables.size > 0;
    $: totalCapacity = tables.reduce((sum, table) => sum + table.seat_capacity, 0);
    $: availableTables = tables.filter(t => t.status === 'available');
    $: occupiedTables = tables.filter(t => t.status === 'occupied');
    $: reservedTables = tables.filter(t => t.status === 'reserved');

    function handleAddTableClick() {
        dispatch('addTableRequest');
    }
    
    function handleBulkDelete() {
        if (selectedTables.size > 0) {
            dispatch('bulkDelete', Array.from(selectedTables));
            selectedTables.clear();
            selectedTables = selectedTables; // Trigger reactivity
        }
    }
    
    function handleFilterChange(status: string) {
        filterStatus = status;
        dispatch('filterChange', status);
    }
    
    function toggleTableSelection(tableId: string) {
        if (selectedTables.has(tableId)) {
            selectedTables.delete(tableId);
        } else {
            selectedTables.add(tableId);
        }
        selectedTables = selectedTables; // Trigger reactivity
    }
    
    function selectAllTables() {
        selectedTables = new Set(tables.map(t => t.id));
    }
    
    function clearSelection() {
        selectedTables.clear();
        selectedTables = selectedTables; // Trigger reactivity
    }
</script>

<div class="space-y-6">
    <!-- Quick Stats -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 class="w-5 h-5 mr-2" />
            Тойм
        </h3>
        <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{tables.length}</div>
                <div class="text-sm text-blue-800">Нийт ширээ</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{totalCapacity}</div>
                <div class="text-sm text-green-800">Нийт суудал</div>
            </div>
            <div class="text-center p-3 bg-emerald-50 rounded-lg">
                <div class="text-2xl font-bold text-emerald-600">{availableTables.length}</div>
                <div class="text-sm text-emerald-800">Сул</div>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{occupiedTables.length}</div>
                <div class="text-sm text-red-800">Эзлэгдсэн</div>
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Үйлдэл</h3>
        <div class="space-y-3">
            <Button on:click={handleAddTableClick} class="w-full justify-start">
                <Plus class="w-4 h-4 mr-2" />
                Шинэ ширээ нэмэх
            </Button>
            
            {#if showBulkActions}
                <Button 
                    variant="destructive" 
                    on:click={handleBulkDelete} 
                    class="w-full justify-start"
                >
                    <Trash2 class="w-4 h-4 mr-2" />
                    Сонгосон ширээг устгах ({selectedTables.size})
                </Button>
                <Button 
                    variant="secondary" 
                    on:click={clearSelection} 
                    class="w-full justify-start"
                >
                    Сонголтыг цэвэрлэх
                </Button>
            {/if}
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter class="w-5 h-5 mr-2" />
            Шүүлтүүр
        </h3>
        <div class="space-y-2">
            <button 
                class="w-full text-left px-3 py-2 rounded-md transition-colors {filterStatus === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50'}"
                on:click={() => handleFilterChange('all')}
            >
                Бүх ширээ ({tables.length})
            </button>
            <button 
                class="w-full text-left px-3 py-2 rounded-md transition-colors {filterStatus === 'available' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'}"
                on:click={() => handleFilterChange('available')}
            >
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Сул ({availableTables.length})
                </div>
            </button>
            <button 
                class="w-full text-left px-3 py-2 rounded-md transition-colors {filterStatus === 'occupied' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-50'}"
                on:click={() => handleFilterChange('occupied')}
            >
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Эзлэгдсэн ({occupiedTables.length})
                </div>
            </button>
            <button 
                class="w-full text-left px-3 py-2 rounded-md transition-colors {filterStatus === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-50'}"
                on:click={() => handleFilterChange('reserved')}
            >
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Захиалгатай ({reservedTables.length})
                </div>
            </button>
        </div>
    </div>

    <!-- Table List -->
    {#if tables.length > 0}
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <Grid3x3 class="w-5 h-5 mr-2" />
                    Ширээний жагсаалт
                </h3>
                <div class="flex space-x-2">
                    <Button variant="outline" size="sm" on:click={selectAllTables}>
                        Бүгдийг сонгох
                    </Button>
                    {#if selectedTables.size > 0}
                        <Button variant="outline" size="sm" on:click={clearSelection}>
                            Цэвэрлэх
                        </Button>
                    {/if}
                </div>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
                {#each tables as table (table.id)}
                    <div 
                        class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        class:bg-blue-50={selectedTables.has(table.id)}
                        class:border-blue-300={selectedTables.has(table.id)}
                    >
                        <div class="flex items-center space-x-3">
                            <input 
                                type="checkbox" 
                                checked={selectedTables.has(table.id)}
                                on:change={() => toggleTableSelection(table.id)}
                                class="rounded border-gray-300"
                            />
                            <div>
                                <div class="font-medium text-gray-900">{table.table_number}</div>
                                <div class="flex items-center text-sm text-gray-500">
                                    <Users class="w-3 h-3 mr-1" />
                                    {table.seat_capacity} суудал
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div 
                                class="px-2 py-1 rounded-full text-xs font-medium"
                                class:bg-green-100={table.status === 'available'}
                                class:text-green-800={table.status === 'available'}
                                class:bg-red-100={table.status === 'occupied'}
                                class:text-red-800={table.status === 'occupied'}
                                class:bg-yellow-100={table.status === 'reserved'}
                                class:text-yellow-800={table.status === 'reserved'}
                            >
                                {table.status === 'available' ? 'Сул' : 
                                 table.status === 'occupied' ? 'Эзлэгдсэн' : 
                                 'Захиалгатай'}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
