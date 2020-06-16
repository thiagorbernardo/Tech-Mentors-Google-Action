module.exports = async function mockOutage() {
    const outage_url = 'https://mockclaronet.dextra.tech/technician/v2/outage/212/davi/5401/363579400'
    const outage = await getData(outage_url)
    return outage
}
