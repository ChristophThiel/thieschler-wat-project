import { ref, nextTick } from 'vue'
import { mock } from 'vitest-mock-extended'
import { Resource } from '@opencloud-eu/web-client'
import { KeyboardActions, useResourcesStore, FolderViewModeConstants } from '@opencloud-eu/web-pkg'
import { useKeyboardFileNavigation } from '../../../../src/composables/keyboardActions/useKeyboardFileNavigation'
import { createMockStore } from '@opencloud-eu/web-test-helpers'

vi.mock('@opencloud-eu/web-pkg', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  useScrollTo: () => ({ scrollToResource: vi.fn() }),
  focusCheckbox: vi.fn()
}))

function createResource(id: string): Resource {
  return mock<Resource>({ id, processing: false })
}

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

function triggerAction(keyActions: KeyboardActions, key: string, modifier: string | null = null) {
  const action = keyActions.actions.value.find((a) => a.primary === key && a.modifier === modifier)
  action?.callback(new KeyboardEvent('keydown'))
}

describe('useKeyboardFileNavigation', () => {
  it('does not reset selection when navigating to the next file', async () => {
    const resources = [createResource('1'), createResource('2'), createResource('3')]

    createMockStore({
      stubActions: false,
      resourcesStore: { resources }
    })

    const store = useResourcesStore()
    store.addSelection('1')

    const keyActions = createKeyActions()
    const viewMode = ref(FolderViewModeConstants.name.table)

    useKeyboardFileNavigation(keyActions, ref(resources), viewMode)

    const selectionStates: string[][] = []
    store.$subscribe(() => {
      selectionStates.push([...store.selectedIds])
    })

    triggerAction(keyActions, 'ArrowDown')
    await nextTick()
    await nextTick()

    expect(store.selectedIds).toEqual(['2'])
    expect(selectionStates.every((state) => state.length > 0)).toBe(true)
  })

  it('does not reset selection when navigating to the previous file', async () => {
    const resources = [createResource('1'), createResource('2'), createResource('3')]

    createMockStore({
      stubActions: false,
      resourcesStore: { resources }
    })

    const store = useResourcesStore()
    store.addSelection('2')

    const keyActions = createKeyActions()
    const viewMode = ref(FolderViewModeConstants.name.table)

    useKeyboardFileNavigation(keyActions, ref(resources), viewMode)

    const selectionStates: string[][] = []
    store.$subscribe(() => {
      selectionStates.push([...store.selectedIds])
    })

    triggerAction(keyActions, 'ArrowUp')
    await nextTick()
    await nextTick()

    expect(store.selectedIds).toEqual(['1'])
    expect(selectionStates.every((state) => state.length > 0)).toBe(true)
  })

  it.each([
    {
      name: 'select files on shift up',
      start: '5',
      actions: ['ArrowUp'],
      expected: ['5', '4', '3', '2', '1']
    },
    {
      name: 'select files on shift down',
      start: '1',
      actions: ['ArrowDown'],
      expected: ['1', '2', '3', '4', '5']
    },
    {
      name: 'select and deselect files on shift up or down',
      start: '5',
      actions: ['ArrowUp', 'ArrowDown'],
      expected: ['5']
    },
    {
      name: 'select files on shift left',
      start: '3',
      actions: ['ArrowLeft', 'ArrowLeft'],
      expected: ['3', '2', '1']
    },
    {
      name: 'select files on shift right',
      start: '1',
      actions: ['ArrowRight', 'ArrowRight'],
      expected: ['1', '2', '3']
    },
    {
      name: 'select and deselect files on shift left or right',
      start: '3',
      actions: ['ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowLeft'],
      expected: ['3', '2', '1']
    }
  ])('$name', async ({ start, actions, expected }) => {
    // Arrange
    const resources = [...Array(5).keys()].map((key) => createResource((key + 1).toString()))
    const tiles = resources.map((r) => ({
      getAttribute: () => r.id,
      getBoundingClientRect: () => ({ x: (+r.id % 4) * 100 })
    }))
    createMockStore({
      stubActions: false,
      resourcesStore: { resources }
    })
    vi.spyOn(document, 'querySelectorAll').mockReturnValue(tiles as any)
    const store = useResourcesStore()
    const keyActions = createKeyActions()
    const viewMode = ref(FolderViewModeConstants.name.tiles)

    // Act
    store.addSelection(start)

    useKeyboardFileNavigation(keyActions, ref(resources), viewMode)

    const selectionStates: string[][] = []
    store.$subscribe(() => {
      selectionStates.push([...store.selectedIds])
    })

    actions.forEach((action) => triggerAction(keyActions, action, 'Shift'))
    await nextTick()
    await nextTick()

    expect(store.selectedIds).toEqual(expected)
    expect(selectionStates.every((state) => state.length > 0)).toBe(true)
  })
})
