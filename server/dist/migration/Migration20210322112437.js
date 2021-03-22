"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210322112437 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210322112437 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "email" text not null, "password" text not null);');
            this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
            this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
        });
    }
}
exports.Migration20210322112437 = Migration20210322112437;
//# sourceMappingURL=Migration20210322112437.js.map