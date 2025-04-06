import { green, orange, blue, red, grey } from '@ant-design/colors';

// Add the missing groupBy function
const groupBy = (array, keyGetter) => {
    return array.reduce((result, item) => {
        const key = keyGetter(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
};

export const colorMethod = (method) => {
    switch (method) {
        case "POST":
            return green[6];
        case "PUT":
            return orange[6];
        case "GET":
            return blue[6];
        case "DELETE":
            return red[6];
        default:
            return grey[10];
    }
};

export const groupByPermission = (data) => {
    const groupedData = groupBy(data, x => x.module);
    return Object.keys(groupedData).map(key => ({
        module: key,
        permissions: groupedData[key]
    }));
};
