import { Card, Col, Collapse, Row, Tooltip } from 'antd';
import { ProFormSwitch } from '@ant-design/pro-components';
import { grey } from '@ant-design/colors';
import { colorMethod, groupByPermission } from '../../../config/utils';
import { useEffect, useMemo } from 'react';

const { Panel } = Collapse;

const ModuleApi = (props) => {
    const { form, listPermissions, singleRole, openModal } = props;

    // Normalize and consolidate modules to prevent duplicates
    const normalizedPermissions = useMemo(() => {
        if (!listPermissions?.length) return [];

        // Group permissions by normalized module name (trim and lowercase for comparison)
        const moduleMap = new Map();

        listPermissions.forEach(item => {
            if (!item || typeof item !== 'object') return;

            const normalizedName = item.module?.trim() || 'Unknown';
            // Ensure permissions is always an array
            const permissionsArray = Array.isArray(item.permissions) ? item.permissions : [];

            if (!moduleMap.has(normalizedName)) {
                moduleMap.set(normalizedName, {
                    module: normalizedName,
                    permissions: [...permissionsArray]
                });
            } else {
                // If module already exists, append permissions to existing module
                const existingModule = moduleMap.get(normalizedName);
                const existingIds = new Set(existingModule.permissions.map(p => p.id));

                // Only add permissions that don't already exist
                permissionsArray.forEach(permission => {
                    if (permission && permission.id && !existingIds.has(permission.id)) {
                        existingModule.permissions.push(permission);
                    }
                });
            }
        });

        return Array.from(moduleMap.values());
    }, [listPermissions]);

    useEffect(() => {
        if (normalizedPermissions?.length && singleRole?.id && openModal) {
            // current permissions of role
            const userPermissions = groupByPermission(singleRole.permissions || []);

            let p = {};

            normalizedPermissions.forEach(x => {
                let allCheck = true;
                const xPermissions = Array.isArray(x.permissions) ? x.permissions : [];

                xPermissions.forEach(y => {
                    if (!y || !y.id) return;

                    const temp = userPermissions.find(z => z.module === x.module);

                    p[y.id] = false;

                    if (temp) {
                        const isExist = temp.permissions.find(k => k.id === y.id);
                        if (isExist) {
                            p[y.id] = true;
                        } else allCheck = false;
                    } else {
                        allCheck = false;
                    }
                });

                p[x.module] = allCheck;
            });

            form.setFieldsValue({
                name: singleRole.name,
                active: singleRole.active,
                description: singleRole.description,
                permissions: p
            });
        }
    }, [openModal, normalizedPermissions, singleRole, form]);

    const handleSwitchAll = (value, name) => {
        const child = normalizedPermissions?.find(item => item.module === name);
        if (child && Array.isArray(child.permissions)) {
            child.permissions.forEach(item => {
                if (item && item.id) form.setFieldValue(["permissions", item.id], value);
            });
        }
    };

    const handleSingleCheck = (value, child, parent) => {
        if (!child) return;

        form.setFieldValue(["permissions", child], value);

        const temp = normalizedPermissions?.find(item => item.module === parent);
        if (temp?.module) {
            const restPermission = Array.isArray(temp.permissions)
                ? temp.permissions.filter(item => item && item.id !== child)
                : [];

            if (restPermission && restPermission.length) {
                const allTrue = restPermission.every(item => form.getFieldValue(["permissions", item.id]));
                form.setFieldValue(["permissions", parent], allTrue && value);
            }
        }
    };

    return (
        <Card size="small" bordered={false}>
            <Collapse>
                {normalizedPermissions?.map((item, index) => (
                    <Panel
                        header={item.module}
                        key={`${index}-parent`}
                        forceRender
                        extra={
                            <div className="customize-form-item" onClick={e => e.stopPropagation()}>
                                <ProFormSwitch
                                    name={["permissions", item.module]}
                                    fieldProps={{
                                        defaultChecked: false,
                                        onChange: (value) => handleSwitchAll(value, item.module),
                                    }}
                                />
                            </div>
                        }
                    >
                        <Row gutter={[16, 16]}>
                            {(Array.isArray(item.permissions) ? item.permissions : []).map((value, i) => (
                                <Col lg={12} md={12} sm={24} key={`${i}-child-${item.module}`}>
                                    <Card size="small" bodyStyle={{ display: "flex", flex: 1, flexDirection: 'row' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <ProFormSwitch
                                                name={["permissions", value?.id]}
                                                fieldProps={{
                                                    defaultChecked: false,
                                                    onChange: (v) => handleSingleCheck(v, value?.id, item.module)
                                                }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Tooltip title={value?.name}>
                                                <p style={{ paddingLeft: 10, marginBottom: 3 }}>{value?.name || ''}</p>
                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ paddingLeft: 10, fontWeight: 'bold', marginBottom: 0, color: colorMethod(value?.method) }}>
                                                        {value?.method || ''}
                                                    </p>
                                                    <p style={{ paddingLeft: 10, marginBottom: 0, color: grey[5] }}>{value?.apiPath || ''}</p>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Panel>
                ))}
            </Collapse>
        </Card>
    );
};

export default ModuleApi;