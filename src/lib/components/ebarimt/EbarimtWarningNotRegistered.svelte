<script lang="ts">
  export let restaurantTin: string;
</script>

<div class="bg-red-50 border-2 border-red-300 rounded-lg p-5">
  <div class="flex">
    <svg
      class="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      ></path>
    </svg>
    <div class="flex-1">
      <h3 class="text-base font-semibold text-red-900 mb-2">
        Анхааруулга: PosAPI-д бүртгэгдээгүй байна
      </h3>
      <p class="text-sm text-red-800 mb-3">
        Танай байгууллагын дугаар ({restaurantTin}) бүртгэлтэй ч PosAPI системд бүртгэгдээгүй байна. Татварын системээс илгээсэн хүсэлтийг зөвшөөрнө үү.
      </p>
      <div class="bg-white rounded-lg p-4 border border-red-200 mb-3">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">
          Дараах алхмуудыг дагана уу:
        </h4>
        <ol class="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>
            <a
              href="https://etax.mta.mn/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              etax.mta.mn
            </a> сайтад нэвтрэх
          </li>
          <li>Цахим баримтын бүртгэл хэсэгт орох</li>
          <li>Шинэ хүсэлт хүлээн авах</li>
          <li>Хүсэлтийг зөвшөөрөх</li>
        </ol>
      </div>
      <div class="flex items-start gap-2 bg-red-100 rounded p-3">
        <svg
          class="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p class="text-sm text-red-900">
          <strong>Чухал:</strong> Хүсэлтийг зөвшөөрөх хүртэл e-barimt үүсэхгүй.
        </p>
      </div>
    </div>
  </div>
</div>
