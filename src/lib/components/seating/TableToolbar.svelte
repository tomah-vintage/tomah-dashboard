<script lang="ts">
    import Button from '$lib/components/ui/button/Button.svelte';
    import { Plus } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleAddTableClick() {
        dispatch('addTableRequest');
    }
</script>

<div class="flex justify-end items-center mb-4">
    <Button on:click={handleAddTableClick}>
        <Plus class="w-4 h-4 mr-2" />
        Ширээ нэмэх
    </Button>
</div>
