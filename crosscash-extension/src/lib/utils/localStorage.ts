
/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = async (key = '') => {
    try {
        const result = localStorage.getItem(key);

        if (result && typeof result === 'string') {
            return JSON.parse(result);
        }
        return null;
    } catch (error) {
        console.log('Storage: error getting from local for key', key);
        return null;
    }
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const removeLocal = (key = '') => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.log('Storage: error removing local with key', key);
    }
};

