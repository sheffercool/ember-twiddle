import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

let files = () => [
  {
    filename: "templates.application.hbs",
    content: `<MyComponent />`
  },
  {
    filename: "components.my-component.js",
    content: `import Component from '@glimmer/component';

              export default class extends Component {}`
  },
  {
    filename: "components.my-component.hbs",
    content: `My Component`
  },
  {
    filename: "twiddle.json",
    content: `{
      "version": "0.17.0",
      "EmberENV": {
        "FEATURES": {},
        "_TEMPLATE_ONLY_GLIMMER_COMPONENTS": true,
        "_APPLICATION_TEMPLATE_WRAPPER": true,
        "_JQUERY_INTEGRATION": true
      },
      "options": {
        "use_pods": false,
        "enable-testing": false
      },
      "dependencies": {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js",
        "ember": "3.17.0",
        "ember-template-compiler": "3.17.0",
        "ember-testing": "3.17.0"
      },
      "addons": {
        "@glimmer/component": "1.0.0"
      }
    }`
  }
];

module('Acceptance | template-colocation', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('template colocation works with both js and hbs file', async function(assert) {

    await runGist(files());

    assert.equal(outputContents(), 'My Component', 'Colocated template is displayed');
  });

  test('template colocation works with hbs file only', async function(assert) {

    let newFiles = files();
    newFiles.removeObject(newFiles.findBy('filename', 'components.my-component.js'));

    await runGist(newFiles);

    assert.equal(outputContents(), 'My Component', 'Colocated template is displayed');
  });

  test('template colocation works with index.hbs file only', async function(assert) {

    let newFiles = files();
    newFiles.removeObject(newFiles.findBy('filename', 'components.my-component.js'));
    let componentFile = newFiles.findBy('filename', 'components.my-component.hbs');
    let newComponentFile = {
      filename: 'components.my-component.index.hbs',
      content: componentFile.content
    }
    newFiles.removeObject(componentFile);
    newFiles.addObject(newComponentFile);

    await runGist(newFiles);

    assert.equal(outputContents(), 'My Component', 'Colocated template is displayed');
  });

  test('template colocation works with index.js file and index.hbs file', async function(assert) {

    let newFiles = files();
    let jsFile = newFiles.findBy('filename', 'components.my-component.js');
    let hbsFile = newFiles.findBy('filename', 'components.my-component.hbs');
    let newHbsFile = {
      filename: 'components.my-component.index.hbs',
      content: hbsFile.content
    };
    let newJsFile = {
      filename: 'components.my-component.index.js',
      content: jsFile.content
    };
    newFiles.removeObject(hbsFile);
    newFiles.addObject(newHbsFile);
    newFiles.removeObject(jsFile);
    newFiles.addObject(newJsFile);

    await runGist(newFiles);

    assert.equal(outputContents(), 'My Component', 'Colocated template is displayed');
  });
});
