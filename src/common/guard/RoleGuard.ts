// src/common/guard/RoleGuard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/common/database/Enums";
import { ROLES_KEY } from "../decorator/RolesDecorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Handler va class orqali kerakli rollarni olish
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Debug log
        console.log('Required Roles:', requiredRoles);

        // Agar rol kerak bo'lmasa, ruxsat berish
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        // Debug log
        console.log('Request User:', request.user);

        // Foydalanuvchi borligini tekshirish
        const user = request.user;
        if (!user) {
            console.log('User not found in request');
            return false;
        }

        // Foydalanuvchi rolini string tipida olish
        const userRole = user.role?.toString();
        console.log('User Role:', userRole);

        // Rollarni string sifatida solishtirib ko'rish
        for (const role of requiredRoles) {
            console.log(`Comparing role ${role} with user role ${userRole}`);
            if (role.toString() === userRole) {
                console.log('Role match found!');
                return true;
            }
        }

        console.log('No matching role found');
        return false;
    }
}