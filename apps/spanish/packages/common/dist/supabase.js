"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Environment variables will be handled differently in web vs mobile
// Web: NEXT_PUBLIC_* variables
// Mobile: Expo Constants or environment-specific config
const getSupabaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Web environment
        return process.env.NEXT_PUBLIC_SUPABASE_URL;
    }
    else {
        // Mobile environment - will be configured via Expo Constants
        return process.env.EXPO_PUBLIC_SUPABASE_URL;
    }
};
const getSupabaseAnonKey = () => {
    if (typeof window !== 'undefined') {
        // Web environment
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
    else {
        // Mobile environment - will be configured via Expo Constants
        return process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    }
};
exports.supabase = (0, supabase_js_1.createClient)(getSupabaseUrl(), getSupabaseAnonKey());
exports.default = exports.supabase;
//# sourceMappingURL=supabase.js.map