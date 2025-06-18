/**
 * Компонент `OfficeItem` отображает карточку офиса с информацией о его местоположении, квотах, руководителе и контактных данных.
 * Используется в списке офисов (например, в компоненте `OfficeItems`) для представления данных об одном офисе.
 * Карточка имеет адаптивный дизайн, цветную нижнюю границу (на основе индекса) и интерактивное поведение при клике (вывод данных в консоль).
 *
 * @component
 * @example
 * ```tsx
 * <OfficeItem
 *   index={0}
 *   officeData={{
 *     id: 1,
 *     name: "Центральный офис",
 *     location: "Москва, ул. Ленина, 10",
 *     quota: 50,
 *     used_quota: 30,
 *     phone: "+7 (495) 123-45-67",
 *     mail: "office@example.com",
 *     supervisor: {
 *       id: 1,
 *       user: {
 *         first_name: "Иван",
 *         last_name: "Иванов",
 *         email: "ivan@example.com",
 *         full_name: "Иван Иванов"
 *       },
 *       office: 1,
 *       office_name: "Центральный офис",
 *       department: "Продажи"
 *     }
 *   }}
 * />
 * ```
 */
import {cn} from "@/lib/utils";
import {MessageCircle} from "lucide-react";

/**
 * Интерфейс `User` описывает данные пользователя, связанные с руководителем офиса.
 *
 * @interface
 * @property {string} first_name - Имя пользователя.
 * @property {string} last_name - Фамилия пользователя.
 * @property {string} email - Электронная почта пользователя.
 * @property {string} full_name - Полное имя пользователя (комбинация имени, фамилии и отчества, если применимо).
 */
interface User {
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}

/**
 * Интерфейс `Supervisor` описывает данные руководителя офиса.
 *
 * @interface
 * @property {number} id - Уникальный идентификатор руководителя.
 * @property {User} user - Данные пользователя, связанного с руководителем.
 * @property {number} office - Идентификатор офиса, к которому привязан руководитель.
 * @property {string} office_name - Название офиса.
 * @property {string} department - Название подразделения, которым управляет руководитель.
 */
interface Supervisor {
  id: number;
  user: User;
  office: number;
  office_name: string;
  department: string;
}

/**
 * Интерфейс `Office` описывает данные об офисе, отображаемые в карточке.
 *
 * @interface
 * @property {number} id - Уникальный идентификатор офиса.
 * @property {string} location - Местоположение офиса (например, адрес).
 * @property {number} quota - Общее количество квот, выделенных офису.
 * @property {number} used_quota - Количество использованных квот.
 * @property {string} phone - Телефонный номер офиса.
 * @property {string} name - Название офиса.
 * @property {string} mail - Электронная почта офиса.
 * @property {Supervisor} [supervisor] - Данные руководителя офиса (необязательное поле).
 */
interface Office {
  id: number;
  location: string;
  quota: number;
  used_quota: number;
  phone: string;
  name: string;
  mail: string;
  supervisor?: Supervisor;
}

/**
 * Интерфейс `Props` описывает пропсы, которые принимает компонент `OfficeItem`.
 *
 * @interface
 * @property {Office} officeData - Данные об офисе, которые будут отображены в карточке.
 * @property {number} index - Индекс карточки в списке (используется для выбора цвета нижней границы).
 */
interface Props {
  officeData: Office;
  index: number;
}

/**
 * Компонент `OfficeItem` рендерит карточку офиса с информацией о названии, местоположении, квотах,
 * контактных данных и руководителе. Карточка имеет фиксированную ширину (до 516px) и адаптивный дизайн,
 * который изменяется в зависимости от размера экрана. При клике на карточку данные офиса выводятся в консоль.
 *
 * @param {Props} props - Пропсы компонента.
 * @param {Office} props.officeData - Данные офиса.
 * @param {number} props.index - Индекс карточки для стилизации.
 * @returns {JSX.Element} - JSX-элемент карточки офиса.
 */
export const OfficeItem: React.FC<Props> = ({index, officeData}) => {
  /**
   * Массив цветов для нижней границы карточки. Цвет выбирается на основе индекса (`index % 4`).
   * @constant
   * @type {string[]}
   */
  const colors: string[] = [
    "border-b-[#FF5E01]", // Оранжевый
    "border-b-[#9CC700]", // Зеленый
    "border-b-[#01BEC2]", // Бирюзовый
    "border-b-[#FFCB05]", // Желтый
  ];

  /**
   * Имя руководителя, формируется из данных `supervisor`. Если руководитель не указан,
   * возвращается строка "Не указан".
   * @type {string}
   */
  const supervisorName = officeData.supervisor
    ? `${officeData.supervisor.user.first_name} ${officeData.supervisor.user.last_name}`
    : "Не указан";

  /**
   * Электронная почта руководителя. Если руководитель не указан или email отсутствует,
   * используется значение по умолчанию "info@miel.ru".
   * @type {string}
   */
  const supervisorEmail = officeData.supervisor?.user.email || "info@miel.ru";

  return (
    <div
      className={cn("w-full max-w-[516px]")}
      onClick={() => console.log(officeData)}
    >
      <div
        key={index}
        className={`border-solid border-[1px] border-gray-300 p-5 border-b-4 ${colors[index % 4]}`}
      >
        {/* Секция с названием и местоположением офиса */}
        <div>
          <p className="opacity-50 text-base">{officeData.name}</p>
          <p className="text-xl font-semibold">{officeData.location}</p>
        </div>

        {/* Секция с информацией о квотах */}
        <div className="mt-9 sm:mt-10 flex sm:flex-row justify-between">
          <div>
            <p>Количество квот всего</p>
            <p>Количество квот свободно</p>
          </div>
          <div className="flex flex-col sm:items-end text-right">
            <p>{officeData.quota}</p>
            <p>{officeData.used_quota}</p>
          </div>
        </div>

        {/* Разделительная линия */}
        <div className="h-[2px] w-full bg-gray-300 mt-9 sm:mt-10"></div>

        {/* Секция с информацией о руководителе и контактами */}
        <div className="flex mt-7 sm:mt-9 w-full justify-between">
          <div>
            <p>Руководитель</p>
            <p>{officeData.phone ? officeData.phone : "+7 (495) 777-88-83"}</p>
          </div>
          <div>
            <div className="flex gap-2 sm:gap-3">
              <p>{supervisorName}</p>
              <MessageCircle className="opacity-50" />
            </div>
            <p>{supervisorEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};