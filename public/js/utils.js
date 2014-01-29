var JsonStorage = {
    set: function(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    get: function(key, defaultValue) {
        var v = localStorage.getItem(key);
        if (v === null) {
            return defaultValue;
        }
        try {
            return JSON.parse(v);
        } catch (e) {
            //Fine, let's just safely return defaultValue
        }

        return defaultValue;
    }
};