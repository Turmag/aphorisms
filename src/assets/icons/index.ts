import type { DefineComponent } from 'vue';
import Add from './Add.vue';
import Cancel from './Cancel.vue';
import CopyDecor from './CopyDecor.vue';
import Delete from './Delete.vue';
import Edit from './Edit.vue';
import Reset from './Reset.vue';
import Save from './Save.vue';
import Settings from './Settings.vue';

type TIcons = Record<string, DefineComponent>;

export default {
    'add': Add,
    'cancel': Cancel,
    'copy-decor': CopyDecor,
    'delete': Delete,
    'edit': Edit,
    'reset': Reset,
    'save': Save,
    'settings': Settings,
} as unknown as TIcons;
