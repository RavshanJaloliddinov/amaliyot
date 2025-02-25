import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/common/database/Enums';

export const ROLES_KEY = 'roles';
// RolesDecorator.ts
export const RolesDecorator = (...roles: Roles[]) => {
    // String konvertatsiyasi
    const roleStrings = roles.map(r => r.toString());
    console.log('RolesDecorator called with:', roles);
    console.log('Role strings:', roleStrings);
    return SetMetadata(ROLES_KEY, roles);
};