// @ts-check

import shaka from 'shaka-player/dist/shaka-player.ui';

import Environment from '../Environment';
import { e } from '../util';

/**
 * @typedef Config
 * @property {string} material_icon Key of button icon
 * @property {string} title Text of button tooltip
 * @property {() => void} onClick
 */

/**
 * Generic control panel button with icon, text and click handler.
 */
export default class ControlPanelButton extends shaka.ui.Element {
  /**
   * Registers a factory with specified configuration. The returned key may
   * be added to `controlPanelElements` in shaka-player config.
   *
   * @param {Environment} env
   * @param {Partial<Config>} config
   * @returns {string} Key of the registered element factory
   */
  static register(env, config = {}) {
    const key = env.mkid();

    shaka.ui.Controls.registerElement(key, {
      create(rootElement, controls) {
        return new ControlPanelButton(rootElement, controls, config);
      },
    });

    return key;
  }

  /**
   * @param {HTMLElement} parent
   * @param {shaka.ui.Controls} controls
   * @param {Partial<Config>} config
   */
  constructor(parent, controls, config = {}) {
    super(parent, controls);

    const button = e("button", {
      className: "material-icons-round",
    }, [config.material_icon]);

    parent.appendChild(button);

    /** @protected */
    this.sxnd = { config, button };

    if (this.eventManager && config.onClick) {
      this.eventManager.listen(button, 'click', config.onClick);
    }

    this.updateStrings();
  }

  updateStrings() {
    this.sxnd.button.title = this.sxnd.config.title ?? "";
  }
}
