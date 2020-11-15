
import { Component, Prop, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { Dictionary } from 'vue-router/types/router'

@Component
export default class EditPartMixin<T> extends Vue {
  @Prop({ required: true }) protected item!: T
  protected form: Dictionary<any> = {}

  get isItemCreation(): boolean {
    return _.isEmpty(this.item)
  }
}

export interface AbstractEditPart {
  init(): Dictionary<any>
  validate(): Promise<string[]>
  serialize(): Dictionary<any>
}
