<script lang="ts">
  import { goto } from "$app/navigation";

  const handleLogout = async () => {
    await fetch("/logout", {
      method: "POST",
    });
    goto("/login");
  };
</script>

<div class="flex min-h-screen items-center justify-center bg-[#F8F9FA] font-sans">
  <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg shadow-gray-200">
    <h2 class="mb-6 text-center text-2xl font-bold text-[#2C2C2C]">Account</h2>
    <button
      on:click={handleLogout}
      class="w-full rounded-lg bg-[#FF6B35] px-4 py-2 text-white hover:bg-[#E05F2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
      >Logout</button
    >
  </div>
</div>
