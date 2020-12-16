import { PageComponent, H1, Input} from "../core/components";
import { RxElement } from "../core/types";

export default class App extends PageComponent {

  // main container - S1
  mainContainer: RxElement;
  time: string;
  modelText: string;
  sample = { name: {  page: 'google' } };

  constructor() {
    // initialization
    super();

    this.state = {
      time: '00:00:00',
      name : { page: '' }
    }

    this.addChild(
      new Input().model(this.sample.name.page),
      new Input().model(this.sample.name.page),
      new H1().text(this.sample.name.page)
    );
    this.sample.name.page = 'cool';
  }
}
