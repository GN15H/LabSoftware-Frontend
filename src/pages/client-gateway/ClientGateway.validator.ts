import { VehicleData, VehicleDataErrors } from "./ClientGateway.types";

export class VehicleFormValidator {

  private validateBrand(value: string): string | null {
    if (value.length == 0) return "La marca es obligatoria";
    return null;
  }

  private validateModel(value: string): string | null {
    if (value.length == 0) return "El modelo es obligatorio";
    return null;
  }

  private validateYear(value: string): string | null {
    if (value.length == 0) return "El año es obligatorio";
    return null;
  }

  private validatePlate(value: string): string | null {
    if (value.length == 0) return "La placa es obligatoria";
    return null;
  }

  validateAll(value: VehicleData): VehicleDataErrors {
    return {
      plate: this.validatePlate(value.plate),
      model: this.validateModel(value.model),
      year: this.validateYear(value.year),
      brand: this.validateBrand(value.brand),
      type: null
    }
  }

}
