<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { UploadCloud, ArrowLeft, Plus } from 'lucide-svelte';
	import { createAddMenuItemMutation } from '$lib/queries/menu-queries';
	import type { MenuItemFormData } from '$lib/types/menu';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';

	const addMenuItemMutation = createAddMenuItemMutation();

	let formData: MenuItemFormData = {
		name: '',
		category: '',
		description: '',
		price: 0,
		code: ''
	};

	function handleSubmit() {
		$addMenuItemMutation.mutate(formData, {
			onSuccess: () => {
				goto('/menu');
			}
		});
	}
</script>

<div class="p-4 sm:p-6 bg-content-background">
	<div class="mb-4">
		<a href="/menu" class="flex items-center text-sm text-gray-500 hover:underline">
			<ArrowLeft class="w-4 h-4 mr-2" />
			Хоол нэмэх
		</a>
	</div>

	<div class="bg-card-background rounded-lg shadow p-4 sm:p-6">
		<form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="md:col-span-1 space-y-2">
				<div
					class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full"
				>
					<UploadCloud class="w-12 h-12 text-gray-400 mb-2" />
					<p class="text-sm text-gray-500 mb-4">Та бүтээгдэхүүний зураг оруулна уу</p>
					<Button variant="secondary">Зураг татах</Button>
				</div>
			</div>

			<div class="md:col-span-2 space-y-4">
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Ангилал</label>
					<select id="category" bind:value={formData.category} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option value="">Сонгоно уу</option>
                        <option value="Пицца">Пицца</option>
                        <option value="Түргэн хоол">Түргэн хоол</option>
                    </select>
					<p class="text-xs text-gray-500 mt-1">Бүтээгдэхүүний ангилал оруулна уу</p>
				</div>

				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Нэр</label>
					<input type="text" id="name" bind:value={formData.name} placeholder="Жишээ: Цуйван" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
					<p class="text-xs text-gray-500 mt-1">Бүтээгдэхүүний нэрээ оруулна уу</p>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Тайлбар</label>
					<textarea id="description" bind:value={formData.description} rows="4" placeholder="Жишээ: Чибатто талх, коктейль сумсний түрхлэгтэй, үхрийн чанасан мах, бяслаг, салат навч, шарсан өндөг, улаан лооль" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"></textarea>
					<p class="text-xs text-gray-500 mt-1">Бүтээгдэхүүний орц оруулна уу</p>
				</div>

				<div>
					<label for="price" class="block text-sm font-medium text-gray-700 mb-1">Үнэ</label>
					<input type="number" id="price" bind:value={formData.price} placeholder="Жишээ: 12,000₮" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
					<p class="text-xs text-gray-500 mt-1">Бүтээгдэхүүний үнээ оруулна уу</p>
				</div>

				<div>
					<label for="code" class="block text-sm font-medium text-gray-700 mb-1">Код</label>
					<input type="text" id="code" bind:value={formData.code} placeholder="№112233" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
					<p class="text-xs text-gray-500 mt-1">Бүтээгдэхүүний кодоо оруулна уу</p>
				</div>

                <div class="flex justify-end">
                    <Button variant="secondary">
                        <Plus class="w-4 h-4" />
                        <span>Хувилбар нэмэх</span>
                    </Button>
                </div>
			</div>

			<div class="md:col-span-3 flex justify-end space-x-2 mt-4">
				<Button href="/menu" variant="secondary">Цуцлах</Button>
				<Button type="submit" disabled={$addMenuItemMutation.isPending}>
					{#if $addMenuItemMutation.isPending}
						<span>Loading...</span>
					{:else}
						Хадгалах
					{/if}
				</Button>
			</div>
		</form>
	</div>
</div>
