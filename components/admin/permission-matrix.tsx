import { Card } from "@/components/ui";
import type { AppPermission, AppRole } from "@/types/auth";

export interface PermissionMatrixProps {
  roles: AppRole[];
  permissions: AppPermission[];
  rolePermissions: Record<AppRole, AppPermission[]>;
}

export function PermissionMatrix({ roles, permissions, rolePermissions }: PermissionMatrixProps) {
  return (
    <Card title="Permission matrix">
      <div className="permission-matrix">
        <table>
          <thead>
            <tr>
              <th>Permission</th>
              {roles.map((role) => <th key={role}>{role}</th>)}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission}>
                <td>{permission}</td>
                {roles.map((role) => (
                  <td key={`${role}-${permission}`} aria-label={`${role} ${permission}`}>
                    {rolePermissions[role]?.includes(permission) ? "Yes" : "No"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
