const getJwtFromHeaderHelper = ({ authorization }): string => authorization.replace('Bearer ', '')

export default getJwtFromHeaderHelper
