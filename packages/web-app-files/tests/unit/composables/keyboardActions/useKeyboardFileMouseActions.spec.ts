import { ref } from 'vue'
import { useKeyboardFileMouseActions } from '../../../../src/composables/keyboardActions/useKeyboardFileMouseActions'
import { createMockStore } from '@opencloud-eu/web-test-helpers'
import {
  eventBus,
  FolderViewModeConstants,
  KeyboardActions,
  useResourcesStore
} from '@opencloud-eu/web-pkg'

function createKeyActions(): KeyboardActions {
  const actions = ref([])
  return {
    actions,
    selectionCursor: ref(0),
    bindKeyAction: vi.fn((keys, callback) => {
      const id = `action-${actions.value.length}`
      actions.value.push({ id, ...keys, modifier: keys.modifier ?? null, callback })
      return id
    }),
    removeKeyAction: vi.fn(),
    resetSelectionCursor: vi.fn()
  } as unknown as KeyboardActions
}

describe('handleShiftClickAction', () => {
  it('selects range between anchor and clicked item', async () => {
    // Arrange
    const viewMode = ref(FolderViewModeConstants.name.table)

    let nodes: any
    let store: any
    let keyActions: any

    // Act
    nodes = ['1', '2', '3'].map((id) => ({
      getAttribute: () => id,
      classList: { contains: () => id === '2' }
    }))

    createMockStore({ stubActions: false })
    store = useResourcesStore()
    store.addSelection('1')

    keyActions = createKeyActions()

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([
      { parentNode: { children: nodes } } as any
    ] as any)

    // SUT
    useKeyboardFileMouseActions(keyActions, viewMode)

    eventBus.publish('app.files.list.clicked.shift', {
      resource: { id: '3' },
      skipTargetSelection: false
    })

    // Assert
    expect(store.selectedIds).toEqual(['1', '3'])
    expect(store.latestSelectedId).toBe('3')
  })
})
