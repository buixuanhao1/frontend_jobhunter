// Function to determine color based on HTTP method
export const colorMethod = (method) => {
    switch (method) {
        case 'GET':
            return '#61affe';
        case 'POST':
            return '#49cc90';
        case 'PUT':
            return '#fca130';
        case 'DELETE':
            return '#f93e3e';
        case 'PATCH':
            return '#50e3c2';
        default:
            return '#000000';
    }
};

// Function to group permissions by module
export const groupByPermission = (data) => {
    const groups = {};

    if (Array.isArray(data)) {
        data.forEach(item => {
            const { module } = item;
            if (!groups[module]) {
                groups[module] = {
                    module,
                    permissions: []
                };
            }
            groups[module].permissions.push(item);
        });
    }

    return Object.values(groups);
};

// Function to build query params
export const buildQuery = (page, pageSize, filters, additionalParams = {}) => {
    let query = `page=${page}&size=${pageSize}`;

    // Add sort if provided
    if (additionalParams.sort) {
        query += `&sort=${additionalParams.sort}`;
    } else {
        query += `&sort=updatedAt,desc`;
    }

    // Add filters if provided
    const filterStrings = [];

    for (const key in filters) {
        if (filters[key]) {
            filterStrings.push(`${key} ~ '${filters[key]}'`);
        }
    }

    if (filterStrings.length > 0) {
        query = `filter=${filterStrings.join(' and ')}&${query}`;
    }

    return query;
};
