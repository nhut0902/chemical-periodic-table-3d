/**
 * Raw dataset, elements Z = 1..56.
 * Format (17 fields, pipe separated):
 * symbol|nameEn|nameVi|atomicMass|group|period|category|meltK|boilK|density|electronegativity|radiusPm|ionizationKJ|discoveryYear|discoverer|applications|fact
 * "-" means "not applicable / no reliable value" and renders as "—".
 *
 * Values: IUPAC standard atomic weights (2021), melting/boiling at 1 atm,
 * density at 20 °C, Pauling electronegativity, Cordero (2008) covalent radii,
 * NIST first ionisation energies. See SOURCES in src/data/sources.ts.
 */
export const RAW_A = `
H|Hydrogen|Hydro|1.008|1|1|nonmetal|13.99|20.271|0.00008988|2.20|31|1312.0|1766|Henry Cavendish|Nhiên liệu pin nhiên liệu, sản xuất amoniac, làm nguội máy phát điện|Nguyên tố phổ biến nhất vũ trụ, chiếm khoảng 75% khối lượng vật chất thường.
He|Helium|Heli|4.0026|18|1|noble|0.95|4.222|0.0001785|-|28|2372.3|1868|Pierre Janssen và Norman Lockyer|Làm lạnh siêu dẫn, bơm khí cầu, hỗn hợp thở trong lặn sâu|Chỉ có thể hoá lỏng ở 4,2 K và không đông đặc ở áp suất khí quyển.
Li|Lithium|Liti|6.94|1|2|alkali|453.65|1615|0.534|0.98|128|520.2|1817|Johan August Arfwedson|Pin lithium-ion, hợp kim nhẹ, thuốc điều trị rối loạn lưỡng cực|Kim loại nhẹ nhất, nổi trên nước dù phản ứng mãnh liệt với nước.
Be|Beryllium|Beri|9.0122|2|2|alkaline|1560|2742|1.85|1.57|96|899.5|1798|Louis-Nicolas Vauquelin|Cửa sổ máy X-quang, hợp kim hàng không, vật liệu phản xạ neutron|Cứng gấp nhiều lần thép nhưng nhẹ hơn nhôm, và rất độc ở dạng bụi.
B|Boron|Bo|10.81|13|2|metalloid|2349|4200|2.34|2.04|84|800.6|1808|Joseph Louis Gay-Lussac và Louis Jacques Thénard|Thuỷ tinh borosilicate, chất bán dẫn, chất tẩy trùng, vật liệu hấp thụ neutron|Bo tinh khiết cứng như kim cương và là nguyên tố thiết yếu cho một số loài thực vật.
C|Carbon|Cacbon|12.011|14|2|nonmetal|3823|4098|2.267|2.55|76|1086.5|-3750|Không rõ (được dùng từ thời cổ đại)|Thép, vật liệu composite, than hoạt tính, kim cương, pin|Cùng một nguyên tố nhưng tạo ra cả kim cương cứng nhất và than chì mềm nhất, nhờ khác biệt cấu trúc tinh thể.
N|Nitrogen|Nitơ|14.007|15|2|nonmetal|63.15|77.36|0.0012506|3.04|71|1402.3|1772|Daniel Rutherford|Phân bón, khí bảo quản thực phẩm, môi trường trơ cho luyện kim|Chiếm 78% khí quyển nhưng liên kết ba N≡N khiến nitơ rất trơ ở nhiệt độ thường.
O|Oxygen|Oxy|15.999|16|2|nonmetal|54.36|90.20|0.001429|3.44|66|1313.9|1774|Joseph Priestley và Carl Wilhelm Scheele|Hô hấp y tế, luyện thép, xử lý nước, động cơ tên lửa|Chiếm khoảng 21% khí quyển và 46% khối lượng vỏ Trái Đất.
F|Fluorine|Flo|18.998|17|2|halogen|53.48|85.03|0.001696|3.98|57|1681.0|1810|André-Marie Ampère (cô lập bởi Henri Moissan, 1886)|Kem đánh răng, chất làm lạnh, PTFE chống dính, sản xuất uranium hexafluoride|Nguyên tố có độ âm điện cao nhất và phi kim hoạt động mạnh nhất.
Ne|Neon|Neon|20.180|18|2|noble|24.56|27.104|0.0008999|-|58|2080.7|1898|William Ramsay và Morris Travers|Đèn neon, laser, chất làm lạnh cryogenic|Tên gọi bắt nguồn từ tiếng Hy Lạp "neos" nghĩa là mới.
Na|Sodium|Natri|22.990|1|3|alkali|370.87|1156|0.968|0.93|166|495.8|1807|Humphry Davy|Muối ăn, xà phòng, chiếu sáng, chất làm mát lò phản ứng|Natri nguyên chất mềm đến mức có thể cắt bằng dao và cháy trong nước.
Mg|Magnesium|Magie|24.305|2|3|alkaline|923|1363|1.738|1.31|141|737.7|1755|Joseph Black (cô lập bởi Humphry Davy, 1808)|Hợp kim nhẹ cho ô tô, pháo hoa, thực phẩm chức năng|Lõi nguyên tử Mg có thể được tạo ra trong sao nhưng magie chủ yếu đến từ các sao lớn đã chết.
Al|Aluminium|Nhôm|26.982|13|3|post|933.47|2792|2.70|1.61|121|577.5|1825|Hans Christian Ørsted|Máy bay, lon nước, khung cửa, dây dẫn điện|Từng đắt hơn vàng cho đến khi quy trình điện phân Hall–Héroult xuất hiện năm 1886.
Si|Silicon|Silic|28.085|14|3|metalloid|1687|3538|2.3296|1.90|111|786.5|1824|Jöns Jacob Berzelius|Chất bán dẫn, pin mặt trời, thuỷ tinh, chip vi xử lý|Nền tảng của toàn bộ ngành điện tử hiện đại, chiếm 28% khối lượng vỏ Trái Đất.
P|Phosphorus|Photpho|30.974|15|3|nonmetal|317.3|553.7|1.823|2.19|107|1011.8|1669|Hennig Brand|Phân bón, diêm, chất tẩy rửa, thuốc trừ sâu|Được phát hiện khi một nhà giả kim Đức đun sôi nước tiểu và thu được chất phát sáng trong bóng tối.
S|Sulfur|Lưu huỳnh|32.06|16|3|nonmetal|388.36|717.87|2.067|2.58|105|999.6|-2000|Không rõ (được dùng từ thời cổ đại)|Axit sulfuric, lưu hoá cao su, thuốc nhuộm, phân bón|Một trong số ít nguyên tố xuất hiện đơn chất tự nhiên ở dạng màu vàng đặc trưng.
Cl|Chlorine|Clo|35.45|17|3|halogen|171.6|239.11|0.003214|3.16|102|1251.2|1774|Carl Wilhelm Scheele|Khử trùng nước, PVC, thuốc tẩy, dung môi|Khí màu vàng lục, được dùng để khử trùng nước uống từ đầu thế kỷ 20.
Ar|Argon|Argon|39.948|18|3|noble|83.80|87.302|0.0017837|-|106|1520.6|1894|Lord Rayleigh và William Ramsay|Khí bảo vệ trong hàn, đèn huỳnh quang, hệ thống chữa cháy|Chiếm gần 1% khí quyển Trái Đất, nhiều hơn tổng CO₂ khoảng 20 lần.
K|Potassium|Kali|39.098|1|4|alkali|336.53|1032|0.862|0.82|203|418.8|1807|Humphry Davy|Phân bón, xà phòng, muối thay thế, xét nghiệm y học|Ký hiệu K bắt nguồn từ tên La-tinh "kalium".
Ca|Calcium|Canxi|40.078|2|4|alkaline|1115|1757|1.54|1.00|176|589.8|1808|Humphry Davy|Xi măng, vôi, thép, thực phẩm bổ sung, xương và răng|Khoảng 99% canxi trong cơ thể người nằm trong xương và răng.
Sc|Scandium|Scandi|44.956|3|4|transition|1814|3109|2.989|1.36|170|633.1|1879|Lars Fredrik Nilson|Hợp kim nhẹ cho khung xe đạp, đèn LED, thiết bị hàng không|Ứng dụng lớn của scandium là trong hợp kim nhôm cho khung xe đạp cao cấp.
Ti|Titanium|Titan|47.867|4|4|transition|1941|3560|4.54|1.54|160|658.8|1791|William Gregor|Cấy ghép y tế, máy bay, đồ trang sức, pigment trắng|Có tỉ lệ độ bền trên khối lượng cao nhất trong các kim loại phổ biến.
V|Vanadium|Vanadi|50.942|5|4|transition|2183|3680|6.11|1.63|153|650.9|1801|Andrés Manuel del Río|Thép hợp kim, xúc tác, ắc quy dòng chảy|Vanadi trong thép giúp tăng độ bền và khả năng chịu nhiệt đáng kể.
Cr|Chromium|Crom|51.996|6|4|transition|2180|2944|7.15|1.66|139|652.9|1794|Louis-Nicolas Vauquelin|Mạ crôm, thép không gỉ, thuộc da, pigment|Lớp mạ crôm mỏng bảo vệ thép khỏi ăn mòn và tạo bề mặt sáng bóng.
Mn|Manganese|Mangan|54.938|7|4|transition|1519|2334|7.44|1.55|139|717.3|1774|Johan Gottlieb Gahn|Thép, pin khô, thuỷ tinh, xúc tác|Mangan là nguyên tố thiết yếu cho quá trình quang hợp trong thực vật.
Fe|Iron|Sắt|55.845|8|4|transition|1811|3134|7.874|1.83|132|762.5|-2000|Không rõ (được dùng từ thời cổ đại)|Thép, xây dựng, ô tô, hemoglobin|Sắt là thành phần trung tâm của hemoglobin, giúp vận chuyển oxy trong máu.
Co|Cobalt|Coban|58.933|9|4|transition|1768|3200|8.86|1.88|126|760.4|1735|Georg Brandt|Pin lithium-ion, hợp kim siêu cứng, pigment xanh|Tên "cobalt" bắt nguồn từ "kobold", tiếng Đức chỉ các linh hồn gây rắc rối cho thợ mỏ.
Ni|Nickel|Niken|58.693|10|4|transition|1728|3186|8.912|1.91|124|737.1|1751|Axel Fredrik Cronstedt|Thép không gỉ, pin, tiền xu, mạ điện|Niken có thể gây dị ứng da ở một số người khi tiếp xúc kéo dài.
Cu|Copper|Đồng|63.546|11|4|transition|1357.77|2835|8.96|1.90|132|745.5|-9000|Không rõ (được dùng từ thời cổ đại)|Dây dẫn điện, ống nước, hợp kim đồng thau, động cơ|Đồng là một trong những kim loại đầu tiên con người khai thác và nấu chảy.
Zn|Zinc|Kẽm|65.38|12|4|transition|692.68|1180|7.134|1.65|122|906.4|1746|Andreas Sigismund Marggraf|Mạ kẽm chống gỉ, pin, hợp kim đồng thau|Kẽm là nguyên tố vi lượng cần thiết cho hơn 300 enzyme trong cơ thể.
Ga|Gallium|Gali|69.723|13|4|post|302.91|2673|5.91|1.81|122|578.8|1875|Paul-Émile Lecoq de Boisbaudran|Chất bán dẫn GaAs, đèn LED, nhiệt kế nhiệt độ cao|Gali tan chảy trong lòng bàn tay ở 29,8 °C.
Ge|Germanium|Germani|72.630|14|4|metalloid|1211.4|3106|5.323|2.01|120|762|1886|Clemens Winkler|Sợi quang, thấu kính hồng ngoại, chất bán dẫn|Mendeleev đã dự đoán nguyên tố này với tên "eka-silicon" trước khi nó được tìm ra.
As|Arsenic|Asen|74.922|15|4|metalloid|1090|887|5.776|2.18|119|944.5|1250|Albertus Magnus|Chất bán dẫn, thuốc trừ sâu, hợp kim|Asen thăng hoa ở 887 K, nghĩa là nó chuyển thẳng từ rắn sang khí.
Se|Selenium|Selen|78.971|16|4|nonmetal|453|958|4.809|2.55|120|941|1817|Jöns Jacob Berzelius|Chất quang dẫn, thuỷ tinh, thực phẩm chức năng|Selen có tính quang dẫn, được dùng trong máy photocopy thời kỳ đầu.
Br|Bromine|Brom|79.904|17|4|halogen|265.8|332.0|3.122|2.96|120|1139.9|1826|Antoine Jérôme Balard|Thuốc an thần, chất chống cháy, nhiếp ảnh|Brom là một trong hai nguyên tố lỏng ở nhiệt độ phòng, và là phi kim duy nhất ở trạng thái lỏng.
Kr|Krypton|Krypton|83.798|18|4|noble|115.79|119.93|0.003733|3.00|116|1350.8|1898|William Ramsay và Morris Travers|Đèn flash nhiếp ảnh, laser, cửa sổ cách nhiệt|Krypton từng được dùng để định nghĩa đơn vị mét năm 1960.
Rb|Rubidium|Rubidi|85.468|1|5|alkali|312.46|961|1.532|0.82|220|403.0|1861|Robert Bunsen và Gustav Kirchhoff|Đồng hồ nguyên tử, tế bào quang điện, laser|Rubidi được phát hiện nhờ phân tích quang phổ, dựa trên các vạch đỏ đặc trưng.
Sr|Strontium|Stronti|87.62|2|5|alkaline|1050|1655|2.64|0.95|195|549.5|1790|Adair Crawford|Pháo hoa đỏ, nam châm ferrite, sơn phát quang|Stronti tạo màu đỏ tươi đặc trưng trong pháo hoa.
Y|Yttrium|Ytri|88.906|3|5|transition|1799|3609|4.469|1.22|190|600|1794|Johan Gadolin|Đèn LED trắng, chất siêu dẫn YBCO, vật liệu gốm|Ytri là một trong bốn nguyên tố được đặt tên theo ngôi làng Ytterby, Thuỵ Điển.
Zr|Zirconium|Zirconni|91.224|4|5|transition|2128|4682|6.506|1.33|175|640.1|1789|Martin Heinrich Klaproth|Vỏ thanh nhiên liệu hạt nhân, gốm sứ, kim hoàn|Zirconi có tiết diện hấp thụ neutron rất thấp nên được dùng làm vỏ nhiên liệu hạt nhân.
Nb|Niobium|Niobi|92.906|5|5|transition|2750|5017|8.57|1.6|164|652.1|1801|Charles Hatchett|Chất siêu dẫn, thép hợp kim, nam châm|Niobi trở thành siêu dẫn ở nhiệt độ tương đối cao so với nhiều kim loại khác.
Mo|Molybdenum|Molypden|95.95|6|5|transition|2896|4912|10.22|2.16|154|684.3|1778|Carl Wilhelm Scheele|Thép không gỉ, xúc tác, chất bôi trơn|Molypden cần cho enzyme nitrogenase, giúp vi khuẩn cố định đạm từ không khí.
Tc|Technetium|Techneti|98|7|5|transition|2430|4538|11.5|1.9|147|702|1937|Carlo Perrier và Emilio Segrè|Chẩn đoán hình ảnh y học bằng đồng vị Tc-99m|Là nguyên tố nhẹ nhất không có đồng vị bền; mọi đồng vị đều phóng xạ.
Ru|Ruthenium|Ruteni|101.07|8|5|transition|2607|4423|12.37|2.2|146|710.2|1844|Karl Ernst Claus|Xúc tác, thiết bị điện tử, hợp kim bền mài mòn|Ruthenium có khả năng chống ăn mòn rất tốt và thường được dùng trong xúc tác công nghiệp.
Rh|Rhodium|Rhodi|102.91|9|5|transition|2237|3968|12.41|2.28|142|719.7|1803|William Hyde Wollaston|Bộ chuyển đổi xúc tác ô tô, gương, đồ trang sức|Rhodi là kim loại đắt nhất trong nhóm platin, có lúc giá cao gấp nhiều lần vàng.
Pd|Palladium|Paladi|106.42|10|5|transition|1828.05|3236|12.02|2.20|139|804.4|1803|William Hyde Wollaston|Bộ chuyển đổi xúc tác, điện tử, nha khoa|Paladi có thể hấp thụ lượng lớn khí hydro vào mạng tinh thể của nó.
Ag|Silver|Bạc|107.87|11|5|transition|1234.93|2435|10.501|1.93|145|731.0|-3000|Không rõ (được dùng từ thời cổ đại)|Trang sức, điện tử, gương, khử trùng|Bạc có độ dẫn điện cao nhất trong tất cả các nguyên tố.
Cd|Cadmium|Cadmi|112.41|12|5|transition|594.22|1040|8.69|1.69|144|867.8|1817|Friedrich Stromeyer|Pin Ni-Cd, pigment, mạ chống ăn mòn|Cadmi rất độc và đang bị hạn chế sử dụng trong nhiều sản phẩm tiêu dùng.
In|Indium|Indi|114.82|13|5|post|429.75|2345|7.31|1.78|142|558.3|1863|Ferdinand Reich và Hieronymous Richter|Màn hình cảm ứng ITO, hợp kim hàn, chất bán dẫn|Indi oxit thiếc (ITO) tạo lớp dẫn điện trong suốt cho màn hình cảm ứng.
Sn|Tin|Thiếc|118.71|14|5|post|505.08|2875|7.287|1.96|139|708.6|-3500|Không rõ (được dùng từ thời cổ đại)|Hàn thiếc, hợp kim đồng thiếc, lớp phủ chống ăn mòn|Thiếc có thể chuyển thành dạng bột xám ở nhiệt độ thấp, hiện tượng gọi là "bệnh thiếc".
Sb|Antimony|Antimon|121.76|15|5|metalloid|903.78|1860|6.685|2.05|139|834|1540|Vannoccio Biringuccio|Hợp kim ắc quy, chất chống cháy, chất bán dẫn|Antimon từng được dùng trong mỹ phẩm cổ đại, dù rất độc.
Te|Tellurium|Telu|127.60|16|5|metalloid|722.66|1261|6.232|2.1|138|869.3|1782|Franz-Joseph Müller von Reichenstein|Chất bán dẫn, hợp kim, pin mặt trời CdTe|Tellurium hiếm hơn cả bạch kim trong vỏ Trái Đất.
I|Iodine|Iot|126.90|17|5|halogen|386.85|457.4|4.93|2.66|139|1008.4|1811|Bernard Courtois|Sát trùng, muối i-ốt, thuốc cản quang|Iot thăng hoa thành hơi màu tím đặc trưng khi đun nóng nhẹ.
Xe|Xenon|Xenon|131.29|18|5|noble|161.4|165.03|0.005887|2.60|140|1170.4|1898|William Ramsay và Morris Travers|Đèn flash, động cơ ion, gây mê|Xenon là một trong số ít khí hiếm có thể tạo hợp chất hoá học, như XeF₄.
Cs|Caesium|Xesi|132.91|1|6|alkali|301.59|944|1.873|0.79|244|375.7|1860|Robert Bunsen và Gustav Kirchhoff|Đồng hồ nguyên tử, dung dịch khoan, tế bào quang điện|Xesi từng là chuẩn định nghĩa đơn vị giây SI: 9 192 631 770 dao động của nguyên tử ¹³³Cs.
Ba|Barium|Bari|137.33|2|6|alkaline|1000|2170|3.594|0.89|215|502.9|1808|Humphry Davy|Thuốc cản quang, pháo hoa xanh lá, dung dịch khoan|Bari sulfat gần như không tan nên được dùng làm thuốc cản quang an toàn trong chẩn đoán y tế.
`
