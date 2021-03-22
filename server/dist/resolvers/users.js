"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersResolver = exports.UsernamePasswordInput = void 0;
const Users_1 = require("../entities/Users");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const validateRegister_1 = require("../utils/validateRegister");
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "email", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
exports.UsernamePasswordInput = UsernamePasswordInput;
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Users_1.Users, { nullable: true }),
    __metadata("design:type", Users_1.Users)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UsersResolver = class UsersResolver {
    me({ req, em }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            const user = yield em.findOne(Users_1.Users, { id: req.session.userId });
            return user;
        });
    }
    register({ em, req }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const usertest = yield em.findOne(Users_1.Users, { username: options.username });
            const emailtest = yield em.findOne(Users_1.Users, { email: options.email });
            const errors = yield validateRegister_1.validateRegister(options, usertest, emailtest);
            if (errors) {
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const user = em.create(Users_1.Users, {
                username: options.username,
                password: hashedPassword,
                email: options.email,
            });
            yield em.persistAndFlush(user);
            req.session.userId = user.id;
            return { user };
        });
    }
    login({ em, req }, usernameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(Users_1.Users, usernameOrEmail.includes("@")
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail.toLowerCase() });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "that username/email doesn't exit",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "incorrect password",
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            return {
                user,
            };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
__decorate([
    type_graphql_1.Query(() => Users_1.Users, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UsernamePasswordInput]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("usernameOrEmail")),
    __param(2, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersResolver.prototype, "logout", null);
UsersResolver = __decorate([
    type_graphql_1.Resolver()
], UsersResolver);
exports.UsersResolver = UsersResolver;
//# sourceMappingURL=users.js.map