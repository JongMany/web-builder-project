import { ButtonOption } from "@/components/shared/sidebar/palette/setting-option/ButtonOption";
import { ElementBodyModel, ElementModel } from "@/models/element/element.model";

type Props = {
  selectedItem: ElementModel | ElementBodyModel;
};

export const SettingOption = ({ selectedItem }: Props) => {
  if (selectedItem.type === "Button") {
    return <ButtonOption selectedItem={selectedItem} />;
  }

  // if (type === "Label") {
  //   return (
  //     <div>
  //       <h2>Text</h2>
  //       <div>
  //         <label>Font Size</label>
  //         <input type="number" value={parseInt(styles.fontSize)} />
  //       </div>
  //       <div>
  //         <label>Font Weight</label>
  //         <input type="number" value={parseInt(styles.fontWeight)} />
  //       </div>
  //     </div>
  //   );
  // }

  // if (type === "Card") {
  //   return (
  //     <div>
  //       <h2>Card</h2>
  //       <div>
  //         <label>Background Color</label>
  //         <input type="color" value={styles.backgroundColor} />
  //       </div>
  //       <div>
  //         <label>Border Radius</label>
  //         <input type="number" value={parseInt(styles.borderRadius)} />
  //       </div>
  //     </div>
  //   );
  // }
};
