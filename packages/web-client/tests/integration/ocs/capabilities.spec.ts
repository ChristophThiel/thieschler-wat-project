import axios from 'axios'
import https from 'node:https'
import { Capabilities, ocs } from '../../../src/ocs'

describe('ocs capabilities', () => {
  const client = axios.create({
    headers: { Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64') },
    // Force axios to use Node's http adapter instead of happy-dom's XMLHttpRequest.
    // happy-dom's request path ignores NODE_TLS_REJECT_UNAUTHORIZED, which breaks
    // against the backend's self-signed cert. The http adapter respects the agent below.
    adapter: 'http',
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  })
  const ocsClient = ocs(process.env.OCS_BASE_URL || 'http://localhost:9200', client)

  it('reports the backend as an installed OpenCloud product', async () => {
    // Arrange
    const expectedProductName = /opencloud/i
    let actual: Capabilities

    // Act
    actual = await ocsClient.getCapabilities()

    // Assert
    expect(actual.capabilities.core.status.installed).toStrictEqual(true)
    expect(actual.capabilities.core.status.productname).toMatch(expectedProductName)
  })

  it('reports the spaces capability as enabled', async () => {
    // Arrange
    const expectedEnabled = true
    let actual: Capabilities

    // Act
    actual = await ocsClient.getCapabilities()

    // Assert
    expect(actual.capabilities.spaces.enabled).toStrictEqual(expectedEnabled)
  })

  it('reports version information', async () => {
    // Arrange
    const expectedProduct = /opencloud/i
    let actual: Capabilities

    // Act
    actual = await ocsClient.getCapabilities()

    // Assert
    expect(actual.version.product).toMatch(expectedProduct)
    expect(actual.version.string.length).toBeGreaterThan(0)
  })
})
