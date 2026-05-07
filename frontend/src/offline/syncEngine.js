import {
    getQueue,
    removeFromQueue,
} from './offlineQueue'

import {
    retryOperation,
} from './retryManager'
import {
    createInspection,
    transitionInspection,
    updateInspection,
} from '../services/inspectionService'
import {
    createIncident,
    transitionIncident,
    updateIncident,
} from '../services/incidentService'
import {
    createCorrectiveAction,
    transitionCorrectiveAction,
    updateCorrectiveAction,
} from '../services/correctiveActionService'

const operationMap = {
    inspection: {
        create: (item) =>
            createInspection(
                item.payload
            ),
        update: (item) =>
            updateInspection(
                item.id,
                item.payload
            ),
        transition: (item) =>
            transitionInspection(
                item.id,
                item.payload
            ),
    },
    incident: {
        create: (item) =>
            createIncident(item.payload),
        update: (item) =>
            updateIncident(
                item.id,
                item.payload
            ),
        transition: (item) =>
            transitionIncident(
                item.id,
                item.payload
            ),
    },
    corrective_action: {
        create: (item) =>
            createCorrectiveAction(
                item.payload
            ),
        update: (item) =>
            updateCorrectiveAction(
                item.id,
                item.payload
            ),
        transition: (item) =>
            transitionCorrectiveAction(
                item.id,
                item.payload
            ),
    },
}

class SyncEngine {
    async sync() {
        const queue = getQueue()

        for (let index = 0; index < queue.length; index += 1) {
            const item =
                queue[index]
            try {
                await retryOperation(async () => {
                    const handler =
                        operationMap?.[
                            item.module
                        ]?.[
                            item.action
                        ]

                    if (!handler) {
                        throw new Error(
                            `Unsupported offline action: ${item.module}/${item.action}`
                        )
                    }

                    await handler(item)
                })
                removeFromQueue(0)
            } catch (error) {
                console.error(
                    'Sync failed:',
                    error
                )
            }
        }
    }
}

export default new SyncEngine()
