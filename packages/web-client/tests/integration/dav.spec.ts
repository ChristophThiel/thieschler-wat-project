import { DAV, DavResult } from '../../src/webdav/client'

describe('dav', () => {
  const dav = new DAV({
    baseUrl: 'http://localhost:60080',
    headers: () => ({
      Authorization: 'Basic ' + Buffer.from('alice:secret1234').toString('base64')
    })
  })

  it('copy file on dav', async () => {
    // Arrange
    const toCopy = 'copy.txt'
    const copied = 'copied.txt'
    let actual: DavResult

    // Act
    actual = await dav.copy(toCopy, copied)

    // Assert
    expect(actual.status).toStrictEqual(201)
  })

  it('delete file on dav', async () => {
    // Arrange
    const file = 'delete.txt'
    let actual: DavResult

    // Act
    actual = await dav.delete(file)

    // Assert
    expect(actual.status).toStrictEqual(204)
  })

  it('move file on dav', async () => {
    // Arrange
    const toMove = 'move.txt'
    const moved = 'moved.txt'
    let actual: DavResult

    // Act
    actual = await dav.copy(toMove, moved)

    // Assert
    expect(actual.status).toStrictEqual(201)
  })

  it('put file on dav', async () => {
    // Arrange
    const file = {
      path: 'put.txt',
      content: 'put'
    }
    let actual: DavResult

    // Act
    actual = await dav.put(file.path, file.content)

    // Assert
    expect(actual.status).toStrictEqual(201)
  })
})
