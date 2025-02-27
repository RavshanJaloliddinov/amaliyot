import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/common/database/Enums';

export const ROLES_KEY = 'roles';
// RolesDecorator.ts
export const RolesDecorator = (...roles: Roles[]) => {
    // String konvertatsiyasi
    const roleStrings = roles.map(r => r.toString());
    return SetMetadata(ROLES_KEY, roles);
};