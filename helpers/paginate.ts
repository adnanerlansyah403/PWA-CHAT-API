// @ts-ignore
// @ts-nocheck
/**
     * customize paginate
     *
     * @method customPaginate
     *
     * @param data
     * @param page
     * @param perPage
     * @returns {{total: number, perPage: number, lastPage: number, data: *[], page: number}}
*/
function customPaginate(data = [], page = 1, perPage = 10) {
    if (page == "") page = 1;
    const total = data.length;
    return {
        page: Number(page),
        perPage: Number(perPage),
        totalItems: data.length,
        totalPages: Math.ceil(total / Number(perPage)),
        data: data.length > 0 ? data.slice((Number(page) - 1) * Number(perPage), Number(perPage) * Number(page)) : data
    }
}

function loadPaginate(data = [], page = 1, perPage = 4) {
    if (page == "") page = 1;

    const startIdx = (page - 1) * perPage;
    const endIdx = startIdx + perPage;

    const total = data.length;
    const paginatedData = data.slice(startIdx, endIdx);
    return {
        page: Number(page),
        perPage: Number(perPage),
        totalItems: data.length,
        totalPages: Math.ceil(total / Number(perPage)),
        data: paginatedData,
    };
}

module.exports = { customPaginate, loadPaginate }
