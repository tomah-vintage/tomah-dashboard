<script lang="ts">
  import { createPatchRestaurantMutation } from '$lib/queries/restaurant-queries';
  import { Button } from "$lib/components/ui/button";
  import { toast } from 'svelte-french-toast';

  export let restaurantId: string;

  const patchRestaurantMutation = createPatchRestaurantMutation();
  $: ({ mutate: patchRestaurant, isPending: isSaving } = $patchRestaurantMutation);

  // Example 1: Update only phone and email
  function updateContactInfo() {
    patchRestaurant(
      { 
        id: restaurantId, 
        data: {
          phone: "+976-99887766",
          email: "new-email@restaurant.com"
        }
      },
      {
        onSuccess: () => {
          toast.success('Холбогдох мэдээлэл шинэчлэгдлээ');
        },
        onError: (error) => {
          toast.error(`Алдаа: ${error.message}`);
        }
      }
    );
  }

  // Example 2: Update only delivery settings
  function updateDeliverySettings() {
    patchRestaurant(
      { 
        id: restaurantId, 
        data: {
          delivery_fee: 2500.00,
          minimum_order: 15000.00,
          estimated_delivery_time: 45
        }
      },
      {
        onSuccess: () => {
          toast.success('Хүргэлтийн тохиргоо шинэчлэгдлээ');
        },
        onError: (error) => {
          toast.error(`Алдаа: ${error.message}`);
        }
      }
    );
  }

  // Example 3: Update only status
  function toggleStatus() {
    patchRestaurant(
      { 
        id: restaurantId, 
        data: {
          is_active: false
        }
      },
      {
        onSuccess: () => {
          toast.success('Ресторанй төлөв шинэчлэгдлээ');
        },
        onError: (error) => {
          toast.error(`Алдаа: ${error.message}`);
        }
      }
    );
  }

  // Example 4: Update only images
  function updateImages() {
    patchRestaurant(
      { 
        id: restaurantId, 
        data: {
          logo_url: "https://example.com/new-logo.jpg",
          cover_image_url: "https://example.com/new-cover.jpg"
        }
      },
      {
        onSuccess: () => {
          toast.success('Зургууд шинэчлэгдлээ');
        },
        onError: (error) => {
          toast.error(`Алдаа: ${error.message}`);
        }
      }
    );
  }
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
      <div class="flex items-center">
        <div class="p-3 bg-white/10 rounded-lg mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">PATCH API жишээнүүд</h1>
          <p class="text-green-100 mt-1">Өөр өөр хэсгүүдийг тусад нь шинэчлэх жишээнүүд</p>
        </div>
      </div>
    </div>
    
    <div class="p-8 space-y-8">
      
      <!-- Example 1: Contact Info -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">1. Холбогдох мэдээлэл шинэчлэх</h3>
            <p class="text-sm text-gray-600 mt-1">Зөвхөн утас болон и-мэйл шинэчлэх</p>
          </div>
          <Button on:click={updateContactInfo} disabled={isSaving} variant="outline">
            {isSaving ? 'Илгээж байна...' : 'Шинэчлэх'}
          </Button>
        </div>
        <div class="bg-gray-50 rounded-md p-4">
          <pre class="text-sm text-gray-800 overflow-x-auto"><code>{JSON.stringify({
  "phone": "+976-99887766",
  "email": "new-email@restaurant.com"
}, null, 2)}</code></pre>
        </div>
      </div>

      <!-- Example 2: Delivery Settings -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">2. Хүргэлтийн тохиргоо шинэчлэх</h3>
            <p class="text-sm text-gray-600 mt-1">Хүргэлтийн төлбөр, хамгийн бага захиалга, хүргэх хугацаа</p>
          </div>
          <Button on:click={updateDeliverySettings} disabled={isSaving} variant="outline">
            {isSaving ? 'Илгээж байна...' : 'Шинэчлэх'}
          </Button>
        </div>
        <div class="bg-gray-50 rounded-md p-4">
          <pre class="text-sm text-gray-800 overflow-x-auto"><code>{JSON.stringify({
  "delivery_fee": 2500.00,
  "minimum_order": 15000.00,
  "estimated_delivery_time": 45
}, null, 2)}</code></pre>
        </div>
      </div>

      <!-- Example 3: Status -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">3. Төлөв шинэчлэх</h3>
            <p class="text-sm text-gray-600 mt-1">Зөвхөн ресторанй идэвхтэй эсэх төлөв</p>
          </div>
          <Button on:click={toggleStatus} disabled={isSaving} variant="outline">
            {isSaving ? 'Илгээж байна...' : 'Зогсоох'}
          </Button>
        </div>
        <div class="bg-gray-50 rounded-md p-4">
          <pre class="text-sm text-gray-800 overflow-x-auto"><code>{JSON.stringify({
  "is_active": false
}, null, 2)}</code></pre>
        </div>
      </div>

      <!-- Example 4: Images -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">4. Зураг шинэчлэх</h3>
            <p class="text-sm text-gray-600 mt-1">Лого болон нүүр зураг</p>
          </div>
          <Button on:click={updateImages} disabled={isSaving} variant="outline">
            {isSaving ? 'Илгээж байна...' : 'Шинэчлэх'}
          </Button>
        </div>
        <div class="bg-gray-50 rounded-md p-4">
          <pre class="text-sm text-gray-800 overflow-x-auto"><code>{JSON.stringify({
  "logo_url": "https://example.com/new-logo.jpg",
  "cover_image_url": "https://example.com/new-cover.jpg"
}, null, 2)}</code></pre>
        </div>
      </div>

      <!-- API Information -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">PATCH API давуу тал</h3>
        <ul class="space-y-2 text-sm text-blue-800">
          <li class="flex items-start">
            <svg class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Bandwidth Efficient:</strong> Зөвхөн өөрчлөгдсөн талбаруудыг илгээдэг</span>
          </li>
          <li class="flex items-start">
            <svg class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Safer:</strong> Өөрчлөгдөөгүй өгөгдлийг дарж бичих эрсдэлийг бууруулдаг</span>
          </li>
          <li class="flex items-start">
            <svg class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Flexible:</strong> Нэг эсвэл хэд хэдэн талбарыг хүссэнээрээ шинэчлэх боломжтой</span>
          </li>
          <li class="flex items-start">
            <svg class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Atomic:</strong> Заагдсан бүх өөрчлөлт хамтад нь амжилттай болох эсвэл болохгүй</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</div>