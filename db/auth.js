const supabase = require("./database");



const findUserByEmail = async (email) => {
    const { data } = await supabase.from('users').select().eq('email', email);
    
    if (data.length === 0) return false;
    return await data[0];
};

const findUserById = async (id) => {
    const { data } = await supabase.from('users').select().eq('id', id);

    if (data.length === 0) return false;
    return await data[0];
};


module.exports = {
    findUserByEmail,
    findUserById
}