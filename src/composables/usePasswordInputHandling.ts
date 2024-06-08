import {computed, ref} from 'vue'

export default function (callback, defaultValue = true) {
    const internalKeepPassword = ref(defaultValue)

    return computed({
        get() {
            return internalKeepPassword.value
        },
        set(value) {
            internalKeepPassword.value = value

            if (internalKeepPassword.value) {
                callback()
            }
        }
    })
}