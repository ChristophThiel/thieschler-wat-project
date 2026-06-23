import axios from 'axios'
import { Capabilities, ocs } from '../../../src/ocs'

describe('ocs capabilities', () => {
  const client = axios.create({
    headers: {
      Authorization: 'Basic ' + Buffer.from('alice:secret1234').toString('base64')
    }
  })
  const ocsClient = ocs('http://localhost:60080', client)

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
