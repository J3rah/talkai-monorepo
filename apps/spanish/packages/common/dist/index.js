"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = exports.useEmotions = exports.useSession = exports.supabaseClient = exports.supabase = void 0;
// Supabase client
var supabase_1 = require("./supabase");
Object.defineProperty(exports, "supabase", { enumerable: true, get: function () { return supabase_1.supabase; } });
Object.defineProperty(exports, "supabaseClient", { enumerable: true, get: function () { return __importDefault(supabase_1).default; } });
// Types
__exportStar(require("./types"), exports);
// Stores
var session_1 = require("./stores/session");
Object.defineProperty(exports, "useSession", { enumerable: true, get: function () { return session_1.useSession; } });
var emotions_1 = require("./stores/emotions");
Object.defineProperty(exports, "useEmotions", { enumerable: true, get: function () { return emotions_1.useEmotions; } });
var chat_1 = require("./stores/chat");
Object.defineProperty(exports, "useChat", { enumerable: true, get: function () { return chat_1.useChat; } });
//# sourceMappingURL=index.js.map