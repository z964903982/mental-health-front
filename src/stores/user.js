// stores/user.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const user = ref({ id: null, username: "" });
    const isLoggedIn = ref(false);

    const loadUserFromStorage = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            user.value = storedUser;
            isLoggedIn.value = true;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        user.value = { id: null, username: "" };
        isLoggedIn.value = false;
    };

    return { user, isLoggedIn, loadUserFromStorage, logout };
});
