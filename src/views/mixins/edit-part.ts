
import { IdObject } from '@/api/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Dictionary } from 'vue-router/types/router'

@Component
export default class EditPartMixin<T extends IdObject> extends Vue {
  @Prop({ required: true }) protected item!: T
  protected form: Dictionary<any> = {}

  get isItemCreation(): boolean {
    return !this.item.id
  }
}

export interface AbstractEditPart {
  init(): Dictionary<any>
  validate(): Promise<string[]>
  serialize(): Dictionary<any>
}
