import { useUserSettingsStore } from '../../../../src/composables/stores/userSettings'
import { mock } from 'vitest-mock-extended'
import { User } from '@opencloud-eu/web-client/graph/generated'
import { getComposableWrapper } from '@opencloud-eu/web-test-helpers'
import { createPinia, setActivePinia } from 'pinia'

describe('useUserSettingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('method "setUsers"', () => {
    it('replaces the users list', () => {
      getWrapper({
        setup: (instance) => {
          const users = [mock<User>({ id: '1' }), mock<User>({ id: '2' })]
          instance.setUsers(users)
          expect(instance.users).toEqual(users)
        }
      })
    })
  })

  describe('method "upsertUser"', () => {
    it('adds a user that does not exist yet', () => {
      getWrapper({
        setup: (instance) => {
          const user = mock<User>({ id: '1' })
          instance.upsertUser(user)
          expect(instance.users).toEqual([user])
        }
      })
    })
    it('merges into an existing user instead of duplicating', () => {
      getWrapper({
        setup: (instance) => {
          instance.setUsers([mock<User>({ id: '1', displayName: 'old' })])
          instance.upsertUser(mock<User>({ id: '1', displayName: 'new' }))
          expect(instance.users.length).toBe(1)
          expect(instance.users[0].displayName).toBe('new')
        }
      })
    })
  })

  describe('method "removeUsers"', () => {
    it('removes only the given users by id', () => {
      getWrapper({
        setup: (instance) => {
          const keep = mock<User>({ id: '1' })
          instance.setUsers([keep, mock<User>({ id: '2' })])
          instance.removeUsers([mock<User>({ id: '2' })])
          expect(instance.users).toEqual([keep])
        }
      })
    })
  })

  describe('method "reset"', () => {
    it('clears users and selectedUsers', () => {
      getWrapper({
        setup: (instance) => {
          instance.setUsers([mock<User>({ id: '1' })])
          instance.addSelectedUser(mock<User>({ id: '1' }))
          instance.reset()
          expect(instance.users).toEqual([])
          expect(instance.selectedUsers).toEqual([])
        }
      })
    })
  })
})

function getWrapper({
  setup
}: {
  setup: (instance: ReturnType<typeof useUserSettingsStore>) => void
}) {
  return {
    wrapper: getComposableWrapper(
      () => {
        const instance = useUserSettingsStore()
        setup(instance)
      },
      { pluginOptions: { pinia: false } }
    )
  }
}