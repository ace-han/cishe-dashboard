
import { IdObject } from '@/api/types'
import { ElForm } from 'element-ui/types/form'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Dictionary } from 'vue-router/types/router'

@Component
export default class EditPartMixin<T extends IdObject> extends Vue {
  @Prop({ required: true }) protected item!: T
  protected inited = false
  protected form: Dictionary<any> = {}

  $refs!: {
    form: ElForm
  }

  get isItemCreation(): boolean {
    return !this.item.id
  }
}

export interface AbstractEditPart {
  init(): Dictionary<any>
  // return error desc for fields
  validate(): Promise<string[]>
  serialize(): Dictionary<any>
}
