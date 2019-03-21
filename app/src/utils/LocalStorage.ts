export const isSupported: boolean = (() => {
    try {
        const itemBackup = localStorage.getItem("")
        if (!itemBackup) {localStorage.removeItem("") }
        else { localStorage.setItem("", itemBackup) }
        return true;
    } catch (e) {
        return false;
    }
})()

export function hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null
}

export function getRemainingSpace(): number {
    const itemBackup = localStorage.getItem("")
    let increase = true
    let data = "1"
    let totalData = ""
    let trytotalData = ""
    while (true) {
        try {
            trytotalData = totalData + data
            localStorage.setItem("", trytotalData);
            totalData = trytotalData;
            if (increase) { data += data }
        } catch (e) {
            if (data.length < 2) {
                break;
            }
            increase = false
            data = data.substr(data.length / 2)
        }
    }
    if (!itemBackup) { localStorage.removeItem("") }
    else { localStorage.setItem("", itemBackup) }

    return totalData.length
}

export function getMaximumSpace(): number {
    const backup = getBackup()
    localStorage.clear()
    const max = getRemainingSpace()
    applyBackup(backup)
    return max
}

/**
 * This will return the currently used size of localStorage
 */
export function getUsedSpace(): number {
    let sum = 0

    for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i)
        if (key) {
            const value = localStorage.getItem(key)
            if (value) {
                sum += key.length + value.length
            }
        }
    }

    return sum
}

/**
 * This will return the currently used size of a given Item, returns NaN if key is not found
 * @param key
 */
export function getItemUsedSpace(key: string): number {
    const value = localStorage.getItem(key)
    if (value === null) {
        return NaN
    } else {
        return key.length + value.length
    }
}

/** 
 * Associative-array for localStorage holding key->value 
 */
export interface IBackup {
    [index: string]: string
}

/**
 * This will return a localStorage-backup (Associative-Array key->value)
 */
export function getBackup(): IBackup {
    const backup: IBackup = {}

    for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i)
        if (key) {
            const value = localStorage.getItem(key)
            if (value) {
                backup[key] = value
            }
        }
    }

    return backup
}

/**
 * This will apply a localStorage-IBackup (Associative-Array key->value)
 * @param backup            associative-array 
 * @param fClear             optional flag to clear all existing storage first. Default: true
 * @param fOverwriteExisting optional flag to replace existing keys. Default: true
 */
export function applyBackup(backup: IBackup, fClear: boolean = true, fOverwriteExisting: boolean = true) {
    if (fClear) {
        localStorage.clear()
    }

    for (const key in backup) {
        if (fOverwriteExisting === false && backup[key] !== undefined) {
            continue
        }
        const value = backup[key]
        localStorage.setItem(key, value)
    }
}

/**
 * This functions dumps all keys and values of the local Storage to the console,
 * as well as the current size and number of items
 * @param fShowMaximumSize optional, flag show maximum size of localStorage. Default: false
 */
export function consoleInfo(fShowMaximumSize: boolean = false) {
    let amount = 0
    let size = 0

    for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i)
        if (key) {
            const value = localStorage.getItem(key);
            // tslint:disable-next-line:no-console
            console.log(amount, key, value)
            if (value) {
                size += key.length + value.length
            }
            amount++
        }
    }
    // tslint:disable-next-line:no-console
    console.log("Total entries:", amount)
    // tslint:disable-next-line:no-console
    console.log("Total size:", size)
    if (fShowMaximumSize === true) {
        const maxSize = getMaximumSpace()
        // tslint:disable-next-line:no-console
        console.log("Total size:", maxSize)
    }
}
