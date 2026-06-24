import { SpaceResource } from '@opencloud-eu/web-client'
import { useFileActionsCreateSpaceFromResource } from '../../../../../src/composables/actions/files/useFileActionsCreateSpaceFromResource'

const createSpaceMock = vi.fn()
const copyFilesMock = vi.fn()
const listFilesMock = vi.fn()
const upsertSpaceMock = vi.fn()
const resetSelectionMock = vi.fn()
const dispatchModalMock = vi.fn()
const showMessageMock = vi.fn()
const showErrorMock = vi.fn()

vi.mock('vue3-gettext', () => ({
  useGettext: () => ({
    $gettext: (msg: string) => msg,
    $ngettext: (singular: string) => singular
  })
}))

vi.mock('@opencloud-eu/web-pkg', () => ({
  useMessages: () => ({
    showMessage: showMessageMock,
    showErrorMessage: showErrorMock
  }),
  useAbility: () => ({
    can: () => true
  }),
  useCreateSpace: () => ({
    createSpace: createSpaceMock
  }),
  useClientService: () => ({
    webdav: {
      copyFiles: copyFilesMock,
      listFiles: listFilesMock
    }
  }),
  useRouter: () => ({}),
  useModals: () => ({
    dispatchModal: dispatchModalMock
  }),
  useConfigStore: () => ({
    options: {
      concurrentRequests: { resourceBatchActions: 2 }
    }
  }),
  useSpacesStore: () => ({
    upsertSpace: upsertSpaceMock
  }),
  useResourcesStore: () => ({
    resetSelection: resetSelectionMock
  }),
  useIsResourceNameValid: () => ({
    isSpaceNameValid: () => ({ isValid: true })
  })
}))

describe.runIf(process.env.WAT === 'true')('useFileActionsCreateSpaceFromResource', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('create space from resource', async () => {
    // Arrange
    const spaceId = 'source-space'
    const spaceName = 'New Space'
    const space = { id: spaceId } as unknown as SpaceResource
    const createdSpace = { id: spaceId }
    const resource = {
      id: '1',
      name: 'file1.txt',
      path: '/file1.txt',
      isFolder: false
    }
    createSpaceMock.mockResolvedValue(createdSpace)
    copyFilesMock.mockResolvedValue(undefined)

    // Act
    const { actions } = useFileActionsCreateSpaceFromResource()
    actions.value[0].handler({ resources: [resource], space })
    const modalConfig = dispatchModalMock.mock.calls[0][0]
    await modalConfig.onConfirm(spaceName)

    // Assert
    expect(createSpaceMock).toHaveBeenCalledWith(spaceName)
    expect(upsertSpaceMock).toHaveBeenCalledWith(createdSpace)
    expect(copyFilesMock).toHaveBeenCalledWith(space, resource, createdSpace, {
      path: resource.name
    })
    expect(resetSelectionMock).toHaveBeenCalled()
    expect(showMessageMock).toHaveBeenCalled()
  })
})
