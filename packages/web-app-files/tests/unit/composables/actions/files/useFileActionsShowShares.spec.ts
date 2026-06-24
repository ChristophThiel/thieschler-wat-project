import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRouter = {}
const mockOpenSideBarPanel = vi.fn()
const mockInterceptModifierClick = vi.fn()
const mockCanShare = vi.fn()

vi.mock('@opencloud-eu/web-pkg', () => ({
  useRouter: () => mockRouter,
  useSideBar: () => ({
    openSideBarPanel: mockOpenSideBarPanel
  }),
  useInterceptModifierClick: () => ({
    interceptModifierClick: mockInterceptModifierClick
  }),
  useCanShare: () => ({
    canShare: mockCanShare
  }),
  isLocationTrashActive: vi.fn()
}))

vi.mock('@opencloud-eu/web-client', () => ({
  isProjectSpaceResource: vi.fn()
}))

vi.mock('vue3-gettext', () => ({
  useGettext: () => ({
    $gettext: (s: string) => s
  })
}))

import { isLocationTrashActive } from '@opencloud-eu/web-pkg'
import { isProjectSpaceResource, ShareResource, SpaceResource } from '@opencloud-eu/web-client'
import { useFileActionsShowShares } from '../../../../../src/composables/actions/files/useFileActionsShowShares'

describe.runIf(process.env.WAT === 'true')('useFileActionsShowShares', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createResource = () => ({ id: '1' })

  it('returns one action', () => {
    const { actions } = useFileActionsShowShares()

    expect(actions.value).toHaveLength(1)
    expect(actions.value[0].name).toBe('show-shares')
  })

  describe('isVisible', () => {
    it('action is not visible if location is trash', () => {
      vi.mocked(isLocationTrashActive).mockReturnValue(true)

      const { actions } = useFileActionsShowShares()

      const result = actions.value[0].isVisible({
        space: {} as SpaceResource,
        resources: [createResource()] as ShareResource[]
      })

      expect(result).toBe(false)
    })

    it('action is not visible if multiple resources', () => {
      vi.mocked(isLocationTrashActive).mockReturnValue(false)

      const { actions } = useFileActionsShowShares()

      const result = actions.value[0].isVisible({
        space: {} as SpaceResource,
        resources: [createResource(), createResource()] as ShareResource[]
      })

      expect(result).toBe(false)
    })

    it('action is not visible if resource is space resource', () => {
      vi.mocked(isLocationTrashActive).mockReturnValue(false)
      vi.mocked(isProjectSpaceResource).mockReturnValue(true)

      const { actions } = useFileActionsShowShares()

      const result = actions.value[0].isVisible({
        space: {} as SpaceResource,
        resources: [createResource()] as ShareResource[]
      })

      expect(result).toBe(false)
    })

    it('action not visible if sharing not possible', () => {
      vi.mocked(isLocationTrashActive).mockReturnValue(false)
      vi.mocked(isProjectSpaceResource).mockReturnValue(false)
      mockCanShare.mockReturnValue(false)

      const { actions } = useFileActionsShowShares()

      const result = actions.value[0].isVisible({
        space: {} as SpaceResource,
        resources: [createResource()] as ShareResource[]
      })

      expect(result).toBe(false)
    })

    it('action visible', () => {
      vi.mocked(isLocationTrashActive).mockReturnValue(false)
      vi.mocked(isProjectSpaceResource).mockReturnValue(false)
      mockCanShare.mockReturnValue(true)

      const { actions } = useFileActionsShowShares()

      const result = actions.value[0].isVisible({
        space: {} as SpaceResource,
        resources: [createResource()] as ShareResource[]
      })

      expect(result).toBe(true)
    })
  })

  it('handler opens sidebar', () => {
    mockInterceptModifierClick.mockReturnValue(false)

    const { actions } = useFileActionsShowShares()

    actions.value[0].handler({
      space: {} as SpaceResource,
      resources: [createResource()] as ShareResource[]
    })

    expect(mockOpenSideBarPanel).toHaveBeenCalledWith('sharing')
  })

  it('handler does not open sidebar', () => {
    mockInterceptModifierClick.mockReturnValue(true)

    const { actions } = useFileActionsShowShares()

    actions.value[0].handler({
      resources: [createResource()],
      event: {}
    } as any)

    expect(mockOpenSideBarPanel).not.toHaveBeenCalled()
  })
})
