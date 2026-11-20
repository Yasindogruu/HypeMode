/* ---------- besin veritabanı: 100 g/ml başına (yaklaşık), pw = 1 birimin gramı ---------- */
const ig=(u,k,p,c,f,cat,pw,pu)=>({u,k,p,c,f,cat,pw,pu:pw?(pu||'adet'):undefined});
const ING0={
 'Yulaf ezmesi':ig('g',389,16.9,66,6.9,'Tahıl & Bakliyat'),'Muz':ig('g',89,1.1,23,0.3,'Sebze & Meyve',120),'Yumurta':ig('g',143,12.6,0.7,9.5,'Süt & Yumurta',50),
 'Süt':ig('ml',50,3.4,4.8,1.6,'Süt & Yumurta'),'Domates':ig('g',18,0.9,3.9,0.2,'Sebze & Meyve',120),'Sivri biber':ig('g',20,0.9,4.6,0.2,'Sebze & Meyve',20),
 'Biber':ig('g',26,1,6,0.3,'Sebze & Meyve',120),'Zeytinyağı':ig('g',884,0,0,100,'Diğer'),'Tereyağı':ig('g',717,0.9,0.1,81,'Süt & Yumurta'),
 'Tam buğday ekmeği':ig('g',247,13,41,3.4,'Tahıl & Bakliyat',30,'dilim'),'Süzme yoğurt (az yağlı)':ig('g',73,10,3.6,2,'Süt & Yumurta'),'Yoğurt':ig('g',61,3.5,4.7,3.3,'Süt & Yumurta'),
 'Orman meyvesi':ig('g',50,0.8,12,0.3,'Sebze & Meyve'),'Granola':ig('g',471,10,64,20,'Tahıl & Bakliyat'),'Bal':ig('g',304,0.3,82,0,'Diğer'),
 'Beyaz peynir':ig('g',264,14,4,21,'Süt & Yumurta'),'Avokado':ig('g',160,2,8.5,14.7,'Sebze & Meyve',150),'Whey protein':ig('g',400,80,8,6,'Diğer',30,'ölçek'),
 'Chia tohumu':ig('g',486,17,42,31,'Diğer'),'Lor peyniri':ig('g',100,12,3,4.5,'Süt & Yumurta'),'Zeytin':ig('g',145,1,3.8,15,'Diğer',4),
 'Tavuk göğsü':ig('g',120,22.5,0,2.6,'Et & Balık'),'Tavuk but':ig('g',121,19.7,0,4.1,'Et & Balık'),'Bulgur':ig('g',342,12,76,1.3,'Tahıl & Bakliyat'),
 'Karışık sebze':ig('g',40,2,8,0.3,'Sebze & Meyve'),'Haşlanmış nohut':ig('g',164,8.9,27,2.6,'Tahıl & Bakliyat'),'Salatalık':ig('g',15,0.7,3.6,0.1,'Sebze & Meyve',200),
 'Tam buğday makarna':ig('g',352,13,72,2.5,'Tahıl & Bakliyat'),'Ton balığı (süzülmüş)':ig('g',116,26,0,1,'Et & Balık',120,'kutu'),'Mısır':ig('g',86,3.3,19,1.4,'Sebze & Meyve'),
 'Tortilla':ig('g',300,8,50,7.5,'Tahıl & Bakliyat',60),'Pirinç unu':ig('g',366,6,80,1.4,'Tahıl & Bakliyat'),'Hamburger ekmeği':ig('g',270,9,49,4,'Tahıl & Bakliyat',50,'adet'),'Lavaş':ig('g',275,9,55,1.5,'Tahıl & Bakliyat',70),'Hindi füme':ig('g',104,18,2,2,'Et & Balık'),
 'Labne':ig('g',200,6,4,18,'Süt & Yumurta'),'Kaşar':ig('g',350,25,1,27,'Süt & Yumurta'),'Marul':ig('g',15,1.4,2.9,0.2,'Sebze & Meyve',10,'yaprak'),
 'Kırmızı mercimek':ig('g',358,24,63,2,'Tahıl & Bakliyat'),'Soğan':ig('g',40,1.1,9.3,0.1,'Sebze & Meyve',110),'Kuru soğan':ig('g',40,1.1,9.3,0.1,'Sebze & Meyve',110),
 'Havuç':ig('g',41,0.9,9.6,0.2,'Sebze & Meyve',70),'Kinoa':ig('g',368,14,64,6,'Tahıl & Bakliyat'),'Edamame':ig('g',121,12,9,5,'Sebze & Meyve'),
 'Somon fileto':ig('g',208,20,0,13,'Et & Balık'),'Patates':ig('g',77,2,17,0.1,'Sebze & Meyve',170),'Brokoli':ig('g',34,2.8,7,0.4,'Sebze & Meyve'),
 'Yağsız kıyma':ig('g',176,20,0,10,'Et & Balık'),'Haşlanmış kuru fasulye':ig('g',127,8.7,23,0.5,'Tahıl & Bakliyat'),'Maydanoz':ig('g',36,3,6,0.8,'Sebze & Meyve',50,'demet'),
 'Pirinç':ig('g',360,6.6,79,0.6,'Tahıl & Bakliyat'),'Taze fasulye':ig('g',31,1.8,7,0.2,'Sebze & Meyve'),'Ispanak':ig('g',23,2.9,3.6,0.4,'Sebze & Meyve'),
 'Dana bonfile':ig('g',170,21,0,9,'Et & Balık'),'Kabak':ig('g',17,1.2,3.1,0.3,'Sebze & Meyve',200),'Ayran':ig('ml',37,1.9,2.8,2,'Süt & Yumurta'),
 'Kefir':ig('ml',60,3.4,4.5,3.3,'Süt & Yumurta'),'Çiğ badem':ig('g',579,21,22,50,'Diğer'),'Ceviz içi':ig('g',654,15,14,65,'Diğer'),'Fındık':ig('g',628,15,17,61,'Diğer'),
 'Elma':ig('g',52,0.3,14,0.2,'Sebze & Meyve',180),'Portakal':ig('g',47,0.9,12,0.1,'Sebze & Meyve',150),'Çilek':ig('g',32,0.7,7.7,0.3,'Sebze & Meyve'),
 'Hurma':ig('g',282,2.5,75,0.4,'Sebze & Meyve',8),'Fıstık ezmesi':ig('g',588,25,20,50,'Diğer',15,'yemek kaşığı'),'Leblebi':ig('g',365,20,60,5,'Tahıl & Bakliyat'),
 'Kuru kayısı':ig('g',241,3.4,63,0.5,'Sebze & Meyve'),'Mantar':ig('g',22,3.1,3.3,0.3,'Sebze & Meyve'),'Domates salçası':ig('g',82,4.3,19,0.5,'Diğer',15,'yemek kaşığı'),
 'Hindi göğsü':ig('g',114,24,0,1.5,'Et & Balık'),'Nohut':ig('g',364,19,61,6,'Tahıl & Bakliyat'),'Kuru fasulye':ig('g',333,23.6,60,0.8,'Tahıl & Bakliyat'),'Makarna':ig('g',371,13,75,1.5,'Tahıl & Bakliyat'),'Şeker':ig('g',400,0,100,0,'Diğer')
};
const ING_X=[["Coco Pops (kakaolu mısır gevreği)", "g", 387.0, 5.0, 84.0, 2.5, "Tahıl & Bakliyat", 30.0, "kase"], ["Mısır gevreği (corn flakes)", "g", 378.0, 7.0, 84.0, 0.9, "Tahıl & Bakliyat", 30.0, "kase"], ["Çikolatalı gevrek (Nesquik vb.)", "g", 385.0, 8.0, 78.0, 4.0, "Tahıl & Bakliyat", 30.0, "kase"], ["Müsli", "g", 367.0, 10.0, 66.0, 6.0, "Tahıl & Bakliyat", 45.0, "kase"], ["Kepekli gevrek (fitness, special K vb.)", "g", 375.0, 9.0, 78.0, 2.0, "Tahıl & Bakliyat", 30.0, "kase"], ["Yulaf gevreği (instant)", "g", 379.0, 13.0, 68.0, 6.5, "Tahıl & Bakliyat", 40.0, "kase"], ["Pirinç patlağı", "g", 387.0, 8.0, 81.0, 2.8, "Tahıl & Bakliyat", 9.0], ["Beyaz ekmek", "g", 265.0, 9.0, 49.0, 3.2, "Tahıl & Bakliyat", 25.0, "dilim"], ["Kepekli ekmek", "g", 240.0, 10.0, 44.0, 3.0, "Tahıl & Bakliyat", 25.0, "dilim"], ["Çavdar ekmeği", "g", 259.0, 8.5, 48.0, 3.3, "Tahıl & Bakliyat", 30.0, "dilim"], ["Simit", "g", 330.0, 10.0, 58.0, 6.0, "Tahıl & Bakliyat", 110.0], ["Poğaça", "g", 360.0, 8.0, 43.0, 17.0, "Tahıl & Bakliyat", 70.0], ["Açma", "g", 380.0, 7.5, 45.0, 19.0, "Tahıl & Bakliyat", 80.0], ["Bazlama", "g", 290.0, 9.0, 55.0, 3.0, "Tahıl & Bakliyat", 120.0], ["Pide ekmeği", "g", 275.0, 9.0, 53.0, 2.0, "Tahıl & Bakliyat", 80.0, "dilim"], ["Sandviç ekmeği", "g", 280.0, 9.0, 50.0, 4.5, "Tahıl & Bakliyat", 60.0], ["Hamburger ekmeği", "g", 279.0, 9.5, 50.0, 4.3, "Tahıl & Bakliyat", 55.0], ["Kruvasan", "g", 406.0, 8.0, 46.0, 21.0, "Tahıl & Bakliyat", 60.0], ["Galeta", "g", 407.0, 11.0, 73.0, 8.0, "Tahıl & Bakliyat", 10.0], ["Kraker", "g", 440.0, 9.0, 70.0, 14.0, "Atıştırmalık", 5.0], ["Pirinç pilavı", "g", 165.0, 2.7, 28.0, 4.5, "Hazır yemek", 180.0, "porsiyon"], ["Bulgur pilavı", "g", 130.0, 3.5, 24.0, 2.5, "Hazır yemek", 180.0, "porsiyon"], ["Makarna (pişmiş, soslu)", "g", 160.0, 5.5, 27.0, 3.5, "Hazır yemek", 250.0, "porsiyon"], ["Mercimek çorbası", "ml", 60.0, 3.5, 9.0, 1.3, "Hazır yemek", 250.0, "kase"], ["Ezogelin çorbası", "ml", 62.0, 3.0, 10.0, 1.4, "Hazır yemek", 250.0, "kase"], ["Tavuk suyu çorba", "ml", 45.0, 3.0, 5.0, 1.5, "Hazır yemek", 250.0, "kase"], ["Domates çorbası", "ml", 55.0, 1.5, 7.0, 2.4, "Hazır yemek", 250.0, "kase"], ["Yayla çorbası", "ml", 60.0, 2.5, 7.0, 2.5, "Hazır yemek", 250.0, "kase"], ["Kuru fasulye yemeği", "g", 130.0, 7.0, 16.0, 4.5, "Hazır yemek", 250.0, "porsiyon"], ["Nohut yemeği", "g", 140.0, 7.0, 18.0, 4.5, "Hazır yemek", 250.0, "porsiyon"], ["Taze fasulye yemeği (zeytinyağlı)", "g", 80.0, 1.8, 8.0, 4.5, "Hazır yemek", 200.0, "porsiyon"], ["Menemen", "g", 110.0, 6.0, 5.0, 7.5, "Hazır yemek", 200.0, "porsiyon"], ["Sucuklu yumurta", "g", 250.0, 14.0, 2.0, 21.0, "Hazır yemek", 150.0, "porsiyon"], ["Omlet (peynirli)", "g", 190.0, 12.0, 2.0, 15.0, "Hazır yemek", 150.0, "porsiyon"], ["Kaşarlı tost", "g", 290.0, 13.0, 30.0, 13.0, "Hazır yemek", 130.0, "adet"], ["Karışık tost", "g", 300.0, 14.0, 29.0, 14.0, "Hazır yemek", 150.0, "adet"], ["Mantı (yoğurtlu)", "g", 190.0, 8.0, 24.0, 7.0, "Hazır yemek", 300.0, "porsiyon"], ["Lahmacun", "g", 235.0, 10.0, 33.0, 7.0, "Hazır yemek", 140.0, "adet"], ["Kıymalı pide", "g", 255.0, 12.0, 33.0, 8.5, "Hazır yemek", 300.0, "adet"], ["Kaşarlı pide", "g", 280.0, 12.0, 34.0, 11.0, "Hazır yemek", 280.0, "adet"], ["Döner (et, porsiyon)", "g", 215.0, 19.0, 3.0, 14.0, "Hazır yemek", 150.0, "porsiyon"], ["Tavuk döner", "g", 180.0, 20.0, 3.0, 10.0, "Hazır yemek", 150.0, "porsiyon"], ["Tavuk dürüm", "g", 210.0, 13.0, 24.0, 7.0, "Hazır yemek", 300.0, "adet"], ["Et dürüm", "g", 240.0, 13.0, 23.0, 11.0, "Hazır yemek", 300.0, "adet"], ["İskender", "g", 190.0, 11.0, 13.0, 11.0, "Hazır yemek", 400.0, "porsiyon"], ["Izgara köfte", "g", 240.0, 18.0, 5.0, 17.0, "Hazır yemek", 150.0, "porsiyon"], ["İnegöl köfte", "g", 260.0, 17.0, 4.0, 20.0, "Hazır yemek", 150.0, "porsiyon"], ["Karnıyarık", "g", 120.0, 5.0, 7.0, 8.0, "Hazır yemek", 250.0, "porsiyon"], ["İmam bayıldı", "g", 110.0, 1.5, 8.0, 8.0, "Hazır yemek", 250.0, "porsiyon"], ["Yaprak sarma (zeytinyağlı)", "g", 170.0, 3.0, 22.0, 8.0, "Hazır yemek", 30.0, "adet"], ["Biber dolması (etli)", "g", 130.0, 6.0, 12.0, 6.5, "Hazır yemek", 120.0, "adet"], ["Su böreği", "g", 270.0, 10.0, 25.0, 14.0, "Hazır yemek", 150.0, "dilim"], ["Kol böreği / sigara böreği", "g", 310.0, 9.0, 30.0, 17.0, "Hazır yemek", 60.0, "adet"], ["Gözleme (peynirli)", "g", 240.0, 9.0, 30.0, 9.0, "Hazır yemek", 200.0, "adet"], ["Çiğ köfte", "g", 160.0, 4.0, 30.0, 2.5, "Hazır yemek", 200.0, "dürüm"], ["Kumpir", "g", 170.0, 5.0, 20.0, 8.0, "Hazır yemek", 450.0, "adet"], ["Hünkar beğendi", "g", 160.0, 9.0, 7.0, 11.0, "Hazır yemek", 300.0, "porsiyon"], ["Tavuk sote", "g", 140.0, 16.0, 5.0, 6.0, "Hazır yemek", 250.0, "porsiyon"], ["Tavuk şiş", "g", 165.0, 26.0, 1.0, 6.5, "Hazır yemek", 200.0, "porsiyon"], ["Adana kebap", "g", 280.0, 17.0, 2.0, 23.0, "Hazır yemek", 180.0, "porsiyon"], ["Kuzu pirzola", "g", 290.0, 25.0, 0.0, 21.0, "Et & Balık", 60.0, "adet"], ["Hamburger", "g", 255.0, 13.0, 24.0, 12.0, "Hazır yemek", 220.0, "adet"], ["Cheeseburger", "g", 265.0, 14.0, 23.0, 13.0, "Hazır yemek", 240.0, "adet"], ["Pizza (karışık)", "g", 265.0, 11.0, 30.0, 11.0, "Hazır yemek", 110.0, "dilim"], ["Patates kızartması", "g", 312.0, 3.4, 41.0, 15.0, "Hazır yemek", 120.0, "porsiyon"], ["Tavuk nugget", "g", 296.0, 15.0, 16.0, 19.0, "Hazır yemek", 18.0], ["Hot dog", "g", 290.0, 10.0, 24.0, 17.0, "Hazır yemek", 100.0, "adet"], ["Sushi (karışık)", "g", 150.0, 6.0, 28.0, 1.5, "Hazır yemek", 30.0, "adet"], ["Caesar salata", "g", 190.0, 7.0, 8.0, 15.0, "Hazır yemek", 250.0, "porsiyon"], ["Çoban salata", "g", 50.0, 1.0, 5.0, 3.0, "Hazır yemek", 200.0, "porsiyon"], ["Mevsim salata", "g", 40.0, 1.2, 5.0, 2.0, "Hazır yemek", 200.0, "porsiyon"], ["Ton balıklı salata", "g", 120.0, 12.0, 5.0, 6.0, "Hazır yemek", 250.0, "porsiyon"], ["Haydari", "g", 180.0, 6.0, 5.0, 15.0, "Hazır yemek", 50.0, "porsiyon"], ["Humus", "g", 166.0, 8.0, 14.0, 9.6, "Hazır yemek", 60.0, "porsiyon"], ["Tam yağlı süt", "ml", 61.0, 3.2, 4.7, 3.3, "Süt & Yumurta", 200.0, "bardak"], ["Yarım yağlı süt", "ml", 46.0, 3.3, 4.8, 1.5, "Süt & Yumurta", 200.0, "bardak"], ["Yağsız süt", "ml", 35.0, 3.4, 5.0, 0.1, "Süt & Yumurta", 200.0, "bardak"], ["Laktozsuz süt", "ml", 47.0, 3.3, 4.8, 1.5, "Süt & Yumurta", 200.0, "bardak"], ["Çikolatalı süt", "ml", 83.0, 3.2, 12.0, 2.5, "Süt & Yumurta", 200.0, "kutu"], ["Protein süt / shake (hazır)", "ml", 65.0, 8.0, 5.0, 1.2, "Süt & Yumurta", 330.0, "şişe"], ["Badem sütü", "ml", 15.0, 0.5, 0.3, 1.2, "İçecek", 200.0, "bardak"], ["Yulaf sütü", "ml", 46.0, 1.0, 6.7, 1.5, "İçecek", 200.0, "bardak"], ["Soya sütü", "ml", 39.0, 3.3, 1.8, 1.9, "İçecek", 200.0, "bardak"], ["Meyveli yoğurt", "g", 95.0, 3.5, 15.0, 2.5, "Süt & Yumurta", 150.0, "kase"], ["Yoğurt (tam yağlı)", "g", 61.0, 3.5, 4.7, 3.3, "Süt & Yumurta", 150.0, "kase"], ["Yoğurt (light)", "g", 42.0, 4.0, 5.5, 0.5, "Süt & Yumurta", 150.0, "kase"], ["Skyr / proteinli yoğurt", "g", 63.0, 11.0, 4.0, 0.2, "Süt & Yumurta", 150.0, "kase"], ["Puding (sütlü)", "g", 125.0, 3.0, 20.0, 3.5, "Atıştırmalık", 120.0, "kase"], ["Sütlaç", "g", 130.0, 3.5, 22.0, 3.0, "Atıştırmalık", 200.0, "kase"], ["Kazandibi", "g", 150.0, 4.0, 25.0, 3.8, "Atıştırmalık", 150.0, "porsiyon"], ["Tulum peyniri", "g", 360.0, 24.0, 1.0, 29.0, "Süt & Yumurta", 30.0, "dilim"], ["Krem peynir", "g", 340.0, 6.0, 4.0, 34.0, "Süt & Yumurta", 20.0, "yemek kaşığı"], ["Mozzarella", "g", 280.0, 22.0, 2.2, 20.0, "Süt & Yumurta", 30.0, "dilim"], ["Parmesan", "g", 431.0, 38.0, 4.0, 29.0, "Süt & Yumurta", 10.0, "yemek kaşığı"], ["Hellim", "g", 320.0, 21.0, 2.0, 25.0, "Süt & Yumurta", 30.0, "dilim"], ["Dil peyniri", "g", 300.0, 22.0, 2.0, 23.0, "Süt & Yumurta", 30.0, "dilim"], ["Süzme peynir (light)", "g", 180.0, 18.0, 3.0, 10.0, "Süt & Yumurta", 30.0, "dilim"], ["Dondurma (sade)", "g", 207.0, 3.5, 24.0, 11.0, "Atıştırmalık", 65.0, "top"], ["Krema", "ml", 340.0, 2.0, 3.0, 36.0, "Süt & Yumurta", 15.0, "yemek kaşığı"], ["Yumurta akı", "g", 52.0, 11.0, 0.7, 0.2, "Süt & Yumurta", 33.0, "adet"], ["Haşlanmış yumurta", "g", 155.0, 12.6, 1.1, 10.6, "Süt & Yumurta", 50.0, "adet"], ["Sucuk", "g", 450.0, 20.0, 2.0, 40.0, "Et & Balık", 10.0, "dilim"], ["Salam", "g", 330.0, 13.0, 2.0, 30.0, "Et & Balık", 10.0, "dilim"], ["Sosis", "g", 280.0, 12.0, 3.0, 25.0, "Et & Balık", 40.0, "adet"], ["Pastırma", "g", 250.0, 30.0, 1.0, 14.0, "Et & Balık", 10.0, "dilim"], ["Jambon (hindi)", "g", 110.0, 18.0, 2.0, 3.5, "Et & Balık", 15.0, "dilim"], ["Dana kıyma (orta yağlı)", "g", 250.0, 17.0, 0.0, 20.0, "Et & Balık"], ["Dana kuşbaşı", "g", 200.0, 20.0, 0.0, 13.0, "Et & Balık"], ["Kuzu eti", "g", 280.0, 17.0, 0.0, 23.0, "Et & Balık"], ["Tavuk kanat", "g", 200.0, 18.0, 0.0, 14.0, "Et & Balık", 35.0, "adet"], ["Tavuk göğsü (ızgara)", "g", 165.0, 31.0, 0.0, 3.6, "Et & Balık"], ["Levrek", "g", 124.0, 20.0, 0.0, 4.5, "Et & Balık"], ["Çipura", "g", 135.0, 20.0, 0.0, 6.0, "Et & Balık"], ["Hamsi", "g", 131.0, 20.0, 0.0, 5.0, "Et & Balık"], ["Uskumru", "g", 205.0, 19.0, 0.0, 14.0, "Et & Balık"], ["Alabalık", "g", 140.0, 20.0, 0.0, 6.0, "Et & Balık"], ["Karides", "g", 99.0, 24.0, 0.2, 0.3, "Et & Balık"], ["Ton balığı (zeytinyağlı)", "g", 190.0, 25.0, 0.0, 10.0, "Et & Balık", 80.0, "kutu"], ["Kalamar (tava)", "g", 175.0, 18.0, 8.0, 7.5, "Et & Balık"], ["Tofu", "g", 76.0, 8.0, 1.9, 4.8, "Tahıl & Bakliyat"], ["Yeşil mercimek", "g", 352.0, 24.0, 60.0, 1.1, "Tahıl & Bakliyat"], ["Barbunya (haşlanmış)", "g", 127.0, 8.7, 23.0, 0.5, "Tahıl & Bakliyat"], ["Börülce (haşlanmış)", "g", 116.0, 7.7, 21.0, 0.5, "Tahıl & Bakliyat"], ["Esmer pirinç", "g", 370.0, 7.9, 77.0, 2.9, "Tahıl & Bakliyat"], ["Basmati pirinç", "g", 350.0, 8.0, 78.0, 0.6, "Tahıl & Bakliyat"], ["Erişte", "g", 370.0, 14.0, 70.0, 3.5, "Tahıl & Bakliyat"], ["Kuskus", "g", 376.0, 12.8, 77.0, 0.6, "Tahıl & Bakliyat"], ["Un", "g", 364.0, 10.0, 76.0, 1.0, "Tahıl & Bakliyat"], ["Patates püresi", "g", 110.0, 2.0, 15.0, 4.5, "Hazır yemek", 150.0, "porsiyon"], ["Tatlı patates", "g", 86.0, 1.6, 20.0, 0.1, "Sebze & Meyve", 150.0], ["Patlıcan", "g", 25.0, 1.0, 6.0, 0.2, "Sebze & Meyve", 250.0], ["Karnabahar", "g", 25.0, 1.9, 5.0, 0.3, "Sebze & Meyve"], ["Lahana", "g", 25.0, 1.3, 5.8, 0.1, "Sebze & Meyve"], ["Bezelye", "g", 81.0, 5.4, 14.0, 0.4, "Sebze & Meyve"], ["Roka", "g", 25.0, 2.6, 3.7, 0.7, "Sebze & Meyve", 20.0, "demet"], ["Pırasa", "g", 61.0, 1.5, 14.0, 0.3, "Sebze & Meyve"], ["Kırmızı biber", "g", 31.0, 1.0, 6.0, 0.3, "Sebze & Meyve", 150.0], ["Turşu", "g", 15.0, 0.5, 2.5, 0.2, "Sebze & Meyve"], ["Siyah zeytin", "g", 115.0, 0.8, 6.0, 11.0, "Diğer", 4.0], ["Karpuz", "g", 30.0, 0.6, 7.6, 0.2, "Sebze & Meyve", 300.0, "dilim"], ["Kavun", "g", 34.0, 0.8, 8.0, 0.2, "Sebze & Meyve", 250.0, "dilim"], ["Üzüm", "g", 69.0, 0.7, 18.0, 0.2, "Sebze & Meyve"], ["Armut", "g", 57.0, 0.4, 15.0, 0.1, "Sebze & Meyve", 180.0], ["Şeftali", "g", 39.0, 0.9, 10.0, 0.3, "Sebze & Meyve", 150.0], ["Kayısı", "g", 48.0, 1.4, 11.0, 0.4, "Sebze & Meyve", 35.0], ["Kiraz", "g", 63.0, 1.1, 16.0, 0.2, "Sebze & Meyve"], ["Mandalina", "g", 53.0, 0.8, 13.0, 0.3, "Sebze & Meyve", 80.0], ["Kivi", "g", 61.0, 1.1, 15.0, 0.5, "Sebze & Meyve", 75.0], ["Ananas", "g", 50.0, 0.5, 13.0, 0.1, "Sebze & Meyve"], ["Mango", "g", 60.0, 0.8, 15.0, 0.4, "Sebze & Meyve", 200.0], ["Nar", "g", 83.0, 1.7, 19.0, 1.2, "Sebze & Meyve", 250.0], ["İncir", "g", 74.0, 0.8, 19.0, 0.3, "Sebze & Meyve", 50.0], ["Kuru üzüm", "g", 299.0, 3.1, 79.0, 0.5, "Sebze & Meyve"], ["Kuru incir", "g", 249.0, 3.3, 64.0, 0.9, "Sebze & Meyve", 20.0], ["Yaban mersini", "g", 57.0, 0.7, 14.0, 0.3, "Sebze & Meyve"], ["Limon", "g", 29.0, 1.1, 9.0, 0.3, "Sebze & Meyve", 60.0], ["Antep fıstığı", "g", 562.0, 20.0, 28.0, 45.0, "Diğer"], ["Kaju", "g", 553.0, 18.0, 30.0, 44.0, "Diğer"], ["Yer fıstığı", "g", 567.0, 26.0, 16.0, 49.0, "Diğer"], ["Kabak çekirdeği", "g", 559.0, 30.0, 11.0, 49.0, "Diğer"], ["Ay çekirdeği", "g", 584.0, 21.0, 20.0, 51.0, "Diğer"], ["Tahin", "g", 595.0, 17.0, 21.0, 54.0, "Diğer", 15.0, "yemek kaşığı"], ["Pekmez", "g", 290.0, 0.0, 72.0, 0.0, "Diğer", 20.0, "yemek kaşığı"], ["Reçel", "g", 250.0, 0.4, 62.0, 0.1, "Diğer", 20.0, "yemek kaşığı"], ["Nutella / fındık kreması", "g", 539.0, 6.3, 57.0, 31.0, "Diğer", 15.0, "yemek kaşığı"], ["Ketçap", "g", 112.0, 1.2, 26.0, 0.1, "Diğer", 15.0, "yemek kaşığı"], ["Mayonez", "g", 680.0, 1.0, 0.6, 75.0, "Diğer", 15.0, "yemek kaşığı"], ["Hardal", "g", 66.0, 4.0, 6.0, 3.3, "Diğer", 5.0, "çay kaşığı"], ["Ayçiçek yağı", "g", 884.0, 0.0, 0.0, 100.0, "Diğer", 10.0, "yemek kaşığı"], ["Hindistan cevizi yağı", "g", 862.0, 0.0, 0.0, 100.0, "Diğer", 10.0, "yemek kaşığı"], ["Bitter çikolata (%70)", "g", 598.0, 7.8, 46.0, 43.0, "Atıştırmalık", 10.0, "kare"], ["Sütlü çikolata", "g", 535.0, 7.7, 59.0, 30.0, "Atıştırmalık", 10.0, "kare"], ["Gofret", "g", 520.0, 6.0, 63.0, 27.0, "Atıştırmalık", 35.0, "adet"], ["Çikolata bar (Snickers vb.)", "g", 488.0, 7.5, 60.0, 24.0, "Atıştırmalık", 50.0, "adet"], ["Bisküvi", "g", 450.0, 7.0, 70.0, 16.0, "Atıştırmalık", 8.0, "adet"], ["Çikolatalı kurabiye", "g", 490.0, 6.0, 64.0, 24.0, "Atıştırmalık", 15.0, "adet"], ["Kek", "g", 390.0, 6.0, 52.0, 18.0, "Atıştırmalık", 60.0, "dilim"], ["Baklava", "g", 430.0, 6.0, 50.0, 23.0, "Atıştırmalık", 30.0, "dilim"], ["Künefe", "g", 340.0, 8.0, 40.0, 17.0, "Atıştırmalık", 150.0, "porsiyon"], ["Lokum", "g", 330.0, 0.2, 82.0, 0.5, "Atıştırmalık", 12.0, "adet"], ["Cips", "g", 536.0, 7.0, 53.0, 34.0, "Atıştırmalık", 30.0, "paket"], ["Patlamış mısır", "g", 387.0, 13.0, 78.0, 4.5, "Atıştırmalık", 20.0, "kase"], ["Protein bar", "g", 370.0, 30.0, 38.0, 12.0, "Atıştırmalık", 50.0, "adet"], ["Granola bar", "g", 450.0, 8.0, 64.0, 18.0, "Atıştırmalık", 30.0, "adet"], ["Pirinç keki", "g", 387.0, 8.0, 81.0, 2.8, "Atıştırmalık", 9.0, "adet"], ["Kola", "ml", 42.0, 0.0, 10.6, 0.0, "İçecek", 330.0, "kutu"], ["Kola zero / diyet", "ml", 0.3, 0.0, 0.0, 0.0, "İçecek", 330.0, "kutu"], ["Gazoz", "ml", 40.0, 0.0, 10.0, 0.0, "İçecek", 250.0, "şişe"], ["Meyve suyu", "ml", 46.0, 0.4, 11.0, 0.1, "İçecek", 200.0, "bardak"], ["Portakal suyu (taze)", "ml", 45.0, 0.7, 10.0, 0.2, "İçecek", 200.0, "bardak"], ["Soğuk çay (ice tea)", "ml", 30.0, 0.0, 7.5, 0.0, "İçecek", 330.0, "kutu"], ["Enerji içeceği", "ml", 45.0, 0.0, 11.0, 0.0, "İçecek", 250.0, "kutu"], ["Sporcu içeceği", "ml", 26.0, 0.0, 6.4, 0.0, "İçecek", 500.0, "şişe"], ["Çay (şekersiz)", "ml", 1.0, 0.0, 0.2, 0.0, "İçecek", 100.0, "bardak"], ["Çay (1 şekerli)", "ml", 21.0, 0.0, 5.0, 0.0, "İçecek", 100.0, "bardak"], ["Türk kahvesi (şekersiz)", "ml", 5.0, 0.3, 0.6, 0.2, "İçecek", 70.0, "fincan"], ["Filtre kahve", "ml", 2.0, 0.3, 0.0, 0.0, "İçecek", 250.0, "kupa"], ["Latte", "ml", 56.0, 3.0, 4.6, 2.9, "İçecek", 350.0, "bardak"], ["Cappuccino", "ml", 45.0, 2.5, 3.6, 2.3, "İçecek", 250.0, "bardak"], ["Americano", "ml", 1.0, 0.1, 0.0, 0.0, "İçecek", 350.0, "bardak"], ["Sıcak çikolata", "ml", 90.0, 3.5, 13.0, 2.8, "İçecek", 250.0, "kupa"], ["Smoothie (meyveli)", "ml", 60.0, 1.0, 13.0, 0.5, "İçecek", 300.0, "bardak"], ["Şalgam", "ml", 8.0, 0.2, 1.5, 0.0, "İçecek", 300.0, "bardak"], ["Bira", "ml", 43.0, 0.5, 3.6, 0.0, "İçecek", 500.0, "şişe"], ["Şarap", "ml", 83.0, 0.1, 2.6, 0.0, "İçecek", 150.0, "kadeh"], ["Rakı", "ml", 250.0, 0.0, 0.0, 0.0, "İçecek", 50.0, "tek"]];
ING_X.forEach(([n,u,k,p,c,f,cat,pw,pu])=>{if(!ING0[n])ING0[n]=ig(u,k,p,c,f,cat,pw,pu)});
const ING_AL={'cocopops':'Coco Pops (kakaolu mısır gevreği)','cornflakes':'Mısır gevreği (corn flakes)','gevrek':'Mısır gevreği (corn flakes)','misirgevregi':'Mısır gevreği (corn flakes)','nesquik':'Çikolatalı gevrek (Nesquik vb.)','sut':'Süt','ekmek':'Beyaz ekmek','pilav':'Pirinç pilavı','doner':'Döner (et, porsiyon)','kola':'Kola','cocacola':'Kola','nutella':'Nutella / fındık kreması','kahve':'Filtre kahve','cay':'Çay (şekersiz)','patateskizartmasi':'Patates kızartması','tost':'Kaşarlı tost','corba':'Mercimek çorbası','peynir':'Beyaz peynir','yogurt':'Yoğurt','tavuk':'Tavuk göğsü','et':'Dana bonfile','balik':'Somon fileto','kofte':'Izgara köfte','pizza':'Pizza (karışık)','hamburger':'Hamburger','burger':'Hamburger','cips':'Cips','cikolata':'Sütlü çikolata','whey':'Whey protein','protein':'Whey protein','yumurta':'Yumurta','muz':'Muz','elma':'Elma'};
const ingNorm=x=>String(x||'').toLocaleLowerCase('tr-TR').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]/g,'');
function ingFind(q,lim=8){const db=ING(),qn=ingNorm(q);if(!qn)return[];const names=Object.keys(db),sc=[];
  names.forEach(n=>{const nn=ingNorm(n);let v=-1;if(nn===qn)v=100;else if(nn.startsWith(qn))v=80-nn.length/100;else{const ws=n.toLocaleLowerCase('tr-TR').split(/[\s()\/,]+/).map(ingNorm);if(ws.some(w=>w&&w.startsWith(qn)))v=60-nn.length/100;else if(nn.includes(qn))v=40-nn.length/100}if(v>=0)sc.push([v,n])});
  Object.entries(ING_AL).forEach(([a,n])=>{if(db[n]&&(a===qn||a.startsWith(qn))&&!sc.some(x=>x[1]===n))sc.push([a===qn?90:50,n])});
  return sc.sort((a,b)=>b[0]-a[0]).slice(0,lim).map(x=>x[1])}
function ingResolve(v){const db=ING();if(db[v])return v;const f=ingFind(v,2);if(f.length&&(ingNorm(f[0])===ingNorm(v)||ING_AL[ingNorm(v)]===f[0]||f.length===1))return f[0];return v}
/* pişirme durumları: 100 g başına değerler; y = pişmiş ağırlık / çiğ ağırlık (yaklaşık) */
const COOK={
 'Tavuk göğsü':['Çiğ',[['Izgara / fırın',165,31,0,3.6,0.73],['Haşlanmış',151,29,0,3.2,0.77],['Tavada (yağlı)',187,30,0,7,0.72]]],
 'Tavuk but':['Çiğ',[['Izgara / fırın',179,24.8,0,8.2,0.72],['Haşlanmış',176,23,0,8.5,0.74]]],
 'Hindi göğsü':['Çiğ',[['Izgara / fırın',147,30,0,2.1,0.75]]],
 'Yağsız kıyma':['Çiğ',[['Pişmiş (köfte / tavada)',217,26,0,11.8,0.75]]],
 'Dana bonfile':['Çiğ',[['Izgara',218,29,0,11,0.75]]],
 'Somon fileto':['Çiğ',[['Fırın / ızgara',206,22,0,12.4,0.8]]],
 'Yumurta':['Çiğ',[['Haşlanmış',155,12.6,1.1,10.6,1],['Sahanda (yağlı)',196,13.6,0.8,15.3,1],['Omlet / çırpma',149,10,1.6,11,1]]],
 'Pirinç':['Kuru (çiğ)',[['Haşlanmış (yağsız)',130,2.7,28,0.3,2.75],['Pilav (tereyağlı)',165,2.7,28,4.5,2.6]]],
 'Bulgur':['Kuru (çiğ)',[['Pişmiş pilav',83,3.1,18.6,0.2,4.1]]],
 'Tam buğday makarna':['Kuru (çiğ)',[['Haşlanmış',149,6,30,1.7,2.35]]],
 'Makarna':['Kuru (çiğ)',[['Haşlanmış',158,5.8,31,0.9,2.35]]],
 'Kırmızı mercimek':['Kuru (çiğ)',[['Haşlanmış',116,9,20,0.4,3.1]]],
 'Kinoa':['Kuru (çiğ)',[['Haşlanmış',120,4.4,21.3,1.9,3.05]]],
 'Yulaf ezmesi':['Kuru',[['Suyla pişmiş (lapa)',71,2.5,12,1.5,5.5]]],
 'Nohut':['Kuru',[['Haşlanmış',164,8.9,27,2.6,2.2]]],
 'Kuru fasulye':['Kuru',[['Haşlanmış',127,8.7,23,0.5,2.6]]],
 'Patates':['Çiğ',[['Haşlanmış',87,1.9,20,0.1,1],['Fırında',93,2.5,21,0.1,0.85],['Kızartma',312,3.4,41,15,0.5]]],
 'Brokoli':['Çiğ',[['Haşlanmış / buharda',35,2.4,7.2,0.4,1]]],
 'Havuç':['Çiğ',[['Haşlanmış',35,0.8,8.2,0.2,1]]],
 'Taze fasulye':['Çiğ',[['Haşlanmış',35,1.9,7.9,0.3,1]]],
 'Ispanak':['Çiğ',[['Pişmiş',23,3,3.8,0.3,0.8]]],
 'Kabak':['Çiğ',[['Pişmiş',15,1.1,2.7,0.4,0.9]]],
 'Mantar':['Çiğ',[['Sote (az yağlı)',44,3.6,4,2,0.7]]]
};
Object.entries(COOK).forEach(([n,[bl,arr]])=>{const d=ING0[n];if(!d)return;
  d.st=[{n:bl,k:d.k,p:d.p,c:d.c,f:d.f,y:1},...arr.map(([l,k,p,c,f,y])=>({n:l,k,p,c,f,y}))]});
var TMPI=null;const ING=()=>({...ING0,...S.customIng,...(TMPI||{})});
const stOf=(d,st)=>(d&&d.st&&st&&d.st.find(x=>x.n===st))||null;
function lineMac([n,q,u,st]){const d=ING()[n];if(!d||!(q>0))return null;const g=(d.pu&&u===d.pu)?q*d.pw:q;const v=stOf(d,st)||d,m=g/100;return{g,k:v.k*m,p:v.p*m,c:v.c*m,f:v.f*m}}
function sumMac(lines){let t={k:0,p:0,c:0,f:0},unk=0;lines.forEach(l=>{if(!l[0])return;const m=lineMac(l);if(!m){unk++;return}t.k+=m.k;t.p+=m.p;t.c+=m.c;t.f+=m.f});return{...t,unk}}

/* ---------- tarif kütüphanesi (porsiyon başı, yaklaşık değerler) ---------- */
const pc=(a,b)=>`radial-gradient(circle at 35% 30%,${a},${b})`;
const ET='Et & Balık',SU='Süt & Yumurta',SB='Sebze & Meyve',TA='Tahıl & Bakliyat',DG='Diğer';
const rcp=(id,slot,n,e,col,kcal,p,c,f,min,ing,how)=>({id,slot,n,e,col,kcal,p,c,f,min,ing,how});
const RECIPES=[
 rcp('pank','b','Muzlu Yulaf Pankek','🥞',pc('#ffe27a','#f2a900'),520,25,72,15,15,[['Yulaf ezmesi',60,'g',TA],['Muz',1,'adet',SB],['Yumurta',2,'adet',SU],['Süt',100,'ml',SU]],'Hepsini blenderdan geçir, yapışmaz tavada iki yüzünü pişir.'),
 rcp('menemen','b','Menemen + Tam Buğday Ekmek','🍳',pc('#ff9a7a','#e8452c'),510,26,38,27,15,[['Yumurta',3,'adet',SU],['Domates',2,'adet',SB],['Sivri biber',2,'adet',SB],['Zeytinyağı',10,'g',DG],['Tam buğday ekmeği',60,'g',TA]],'Biberi yağda çevir, domatesi ekle, suyunu çekince yumurtaları kır.'),
 rcp('yogbowl','b','Yoğurtlu Meyve Kasesi','🫐',pc('#ff7aa8','#c2185b'),450,25,54,15,5,[['Süzme yoğurt (az yağlı)',200,'g',SU],['Orman meyvesi',100,'g',SB],['Granola',40,'g',TA],['Bal',10,'g',DG]],'Yoğurdu kaseye al, meyve, granola ve balı üstüne ekle.'),
 rcp('omlet','b','Peynirli Omlet + Avokado','🥑',pc('#c7f27a','#6aa31b'),505,29,19,35,10,[['Yumurta',3,'adet',SU],['Beyaz peynir',40,'g',SU],['Avokado',0.5,'adet',SB],['Tam buğday ekmeği',30,'g',TA]],'Yumurtaları çırp, peyniri ekleyip pişir; avokado ve ekmekle servis et.'),
 rcp('overnight','b','Proteinli Gece Yulafı','🥣',pc('#e8d3b0','#a8835a'),540,42,62,14,5,[['Yulaf ezmesi',70,'g',TA],['Süt',200,'ml',SU],['Whey protein',30,'g',DG],['Chia tohumu',10,'g',DG]],'Akşamdan kavanozda karıştır, buzdolabında beklet.'),
 rcp('lortost','b','Lorlu Tost + Zeytin','🥪',pc('#ffd59e','#e08a2c'),380,21,40,14,10,[['Tam buğday ekmeği',60,'g',TA],['Lor peyniri',100,'g',SU],['Domates',1,'adet',SB],['Zeytin',30,'g',DG]],'Ekmek arasına lor ve domates koy, tost makinesinde kızart.'),
 rcp('tavbulgur','l','Tavuklu Bulgur Kasesi','🍗',pc('#ffcf6e','#d98b0b'),620,56,58,16,25,[['Tavuk göğsü',150,'g',ET],['Bulgur',70,'g',TA],['Karışık sebze',100,'g',SB],['Zeytinyağı',10,'g',DG]],'Tavuğu ızgarala, bulguru haşla, sebzelerle kasede birleştir.'),
 rcp('nohut','l','Nohutlu Akdeniz Salatası','🥗',pc('#9fe08a','#3f9a2a'),550,22,64,23,10,[['Haşlanmış nohut',150,'g',TA],['Salatalık',1,'adet',SB],['Domates',1,'adet',SB],['Beyaz peynir',40,'g',SU],['Zeytinyağı',10,'g',DG],['Tam buğday ekmeği',30,'g',TA]],'Sebzeleri doğra, nohut ve peynirle karıştır, yağ ve limonla tatlandır.'),
 rcp('tonmak','l','Ton Balıklı Makarna Salatası','🐟',pc('#8fd3ff','#2a7fc9'),550,43,70,9,20,[['Tam buğday makarna',80,'g',TA],['Ton balığı (süzülmüş)',120,'g',ET],['Mısır',50,'g',SB],['Yoğurt',50,'g',SU],['Zeytinyağı',5,'g',DG]],'Makarnayı haşla, soğut; ton, mısır ve yoğurtlu sosla karıştır.'),
 rcp('wrap','l','Hindi Füme Dürüm','🌯',pc('#f3c98b','#b8742a'),430,33,34,16,5,[['Tortilla',1,'adet',TA],['Hindi füme',100,'g',ET],['Labne',30,'g',SU],['Kaşar',20,'g',SU],['Marul',2,'yaprak',SB]],'Tortillaya labne sür, malzemeleri diz ve sar.'),
 rcp('mercimek','l','Mercimek Çorbası + Yoğurt','🍲',pc('#ffb36b','#d9601a'),530,26,76,15,30,[['Kırmızı mercimek',70,'g',TA],['Soğan',0.5,'adet',SB],['Havuç',1,'adet',SB],['Zeytinyağı',10,'g',DG],['Yoğurt',150,'g',SU],['Tam buğday ekmeği',30,'g',TA]],'Sebzeleri kavur, mercimek ve suyu ekle, pişince blenderdan geçir.'),
 rcp('kinoa','l','Kinoa Avokado Kasesi','🥒',pc('#b8f0a0','#4caf50'),560,21,60,27,20,[['Kinoa',70,'g',TA],['Avokado',0.5,'adet',SB],['Salatalık',1,'adet',SB],['Edamame',80,'g',SB],['Zeytinyağı',5,'g',DG]],'Kinoayı haşla, doğranmış sebzeler ve avokadoyla kasede birleştir.'),
 rcp('somon','d','Fırın Somon + Patates','🍣',pc('#ffb0a0','#e5664f'),500,37,42,20,30,[['Somon fileto',150,'g',ET],['Patates',200,'g',SB],['Brokoli',100,'g',SB]],'Patatesleri 200°C’de 15 dk pişir, somon ve brokoliyi ekleyip 15 dk daha.'),
 rcp('kofte','d','Izgara Köfte + Piyaz','🍖',pc('#d99a72','#8a4b25'),560,41,32,28,25,[['Yağsız kıyma',150,'g',ET],['Haşlanmış kuru fasulye',120,'g',TA],['Kuru soğan',0.5,'adet',SB],['Maydanoz',0.5,'demet',SB],['Zeytinyağı',5,'g',DG]],'Kıymayı yoğur, köfte yap, ızgarada pişir; piyazı hazırla.'),
 rcp('sote','d','Tavuk Sote + Pirinç','🍛',pc('#ffd36e','#c98a00'),640,53,65,16,30,[['Tavuk göğsü',150,'g',ET],['Pirinç',70,'g',TA],['Biber',1,'adet',SB],['Domates',1,'adet',SB],['Zeytinyağı',10,'g',DG]],'Tavuğu sebzelerle sotele, pilavla servis et.'),
 rcp('fasulye','d','Zeytinyağlı Fasulye + Yoğurt','🥘',pc('#b6e388','#5d9b2a'),410,17,42,22,40,[['Taze fasulye',250,'g',SB],['Domates',1,'adet',SB],['Zeytinyağı',15,'g',DG],['Yoğurt',150,'g',SU],['Tam buğday ekmeği',30,'g',TA]],'Fasulyeyi soğan ve domatesle kısık ateşte pişir, ılık servis et.'),
 rcp('ispanak','d','Kıymalı Ispanak + Bulgur','🥬',pc('#8fd98a','#2e7d32'),520,39,51,19,30,[['Ispanak',300,'g',SB],['Yağsız kıyma',100,'g',ET],['Bulgur',50,'g',TA],['Yoğurt',100,'g',SU]],'Kıymayı kavur, ıspanağı ekle; yanında bulgur pilavı ve yoğurt.'),
 rcp('biftek','d','Biftek + Fırın Sebze','🥩',pc('#e88f8f','#a33a3a'),470,43,33,17,25,[['Dana bonfile',150,'g',ET],['Patates',150,'g',SB],['Kabak',1,'adet',SB],['Zeytinyağı',5,'g',DG]],'Sebzeleri fırınla, bifteği döküm tavada iki yüzünü 3’er dk mühürle.'),
 rcp('shake','s','Protein Shake + Muz','🥤',pc('#d8c3ff','#7e57c2'),350,33,42,6,2,[['Whey protein',30,'g',DG],['Muz',1,'adet',SB],['Süt',250,'ml',SU]],'Hepsini shaker ya da blenderda karıştır.'),
 rcp('elma','s','Elma + Fıstık Ezmesi','🍎',pc('#ff8a8a','#d32f2f'),215,5,29,10,2,[['Elma',1,'adet',SB],['Fıstık ezmesi',20,'g',DG]],'Elmayı dilimle, fıstık ezmesiyle ye.'),
 rcp('ayran','s','Ayran + Çiğ Badem','🥛',pc('#f0f4ff','#b0bce0'),255,11,13,18,1,[['Ayran',300,'ml',SU],['Çiğ badem',25,'g',DG]],'Hazır.'),
 rcp('yogbal','s','Süzme Yoğurt + Bal + Ceviz','🍯',pc('#ffe08a','#d4a017'),275,17,16,16,2,[['Süzme yoğurt (az yağlı)',150,'g',SU],['Bal',10,'g',DG],['Ceviz içi',15,'g',DG]],'Yoğurdun üstüne bal ve ceviz ekle.'),
 rcp('yumurta','s','2 Haşlanmış Yumurta + Domates','🥚',pc('#fff3c4','#e0c060'),150,13,4,10,10,[['Yumurta',2,'adet',SU],['Domates',1,'adet',SB]],'Yumurtaları 9 dk haşla.'),
 rcp('leblebi','s','Leblebi + Kuru Kayısı','🥜',pc('#f5c88a','#c07a2a'),185,7,37,2,1,[['Leblebi',30,'g',TA],['Kuru kayısı',30,'g',SB]],'Karıştır, çantana at.')
];
/* hazır tariflerin makrolarını da aynı veritabanından hesapla: tek kaynak, tutarlı kcal */
RECIPES.forEach(r=>{const m=sumMac(r.ing);if(!m.unk){r.kcal=Math.round(m.k);r.p=Math.round(m.p);r.c=Math.round(m.c);r.f=Math.round(m.f)}});
const SLOTS=[['b','Kahvaltı',.25],['l','Öğle',.35],['d','Akşam',.30],['s','Ara öğün',.10]];

const ALL=()=>[...RECIPES,...PHASE_RECIPES,...S.myRecipes];
const rec=id=>ALL().find(r=>r.id===id);
const EMO=['🍲','🥗','🍝','🍛','🥘','🍳','🥣','🥪','🌯','🍗','🥩','🐟','🍚','🥞','🥤','🍰'];
const COLS=[pc('#ffb36b','#d9601a'),pc('#9fe08a','#3f9a2a'),pc('#ffcf6e','#d98b0b'),pc('#ffd36e','#c98a00'),pc('#b6e388','#5d9b2a'),pc('#ff9a7a','#e8452c'),pc('#e8d3b0','#a8835a'),pc('#ffd59e','#e08a2c'),pc('#f3c98b','#b8742a'),pc('#ffcf6e','#d98b0b'),pc('#e88f8f','#a33a3a'),pc('#8fd3ff','#2a7fc9'),pc('#f0f4ff','#b0bce0'),pc('#ffe27a','#f2a900'),pc('#d8c3ff','#7e57c2'),pc('#ff7aa8','#c2185b')];

/* ---------- definasyon / bulk rehber tarifleri (Beslenme Rehberi dokümanıyla aynı) ---------- */
const TG='Tavuk göğsü',EK='Tam buğday ekmeği',ZY='Zeytinyağı',SY='Süzme yoğurt (az yağlı)',SB2='Karışık sebze';
const prc=(id,phase,slot,n,e,min,how,full)=>({id,phase,slot,n,e,col:COLS[EMO.indexOf(e)>=0?EMO.indexOf(e):0],min,how,serv:1,full});
const PHASE_RECIPES=[
 prc('c-menemen','cut','b','Menemen + 2 dilim ekmek','🍳',15,'Biberi az yağda çevir, domatesi ekle, yumurtaları kır. Yanına peynir ve 2 dilim ekmek.',[['Yumurta',3,'adet','Çiğ'],['Domates',2,'adet'],['Sivri biber',2,'adet'],[ZY,5,'g'],[EK,2,'dilim'],['Beyaz peynir',30,'g']]),
 prc('c-yulaf','cut','b','Proteinli yulaf','🥣',5,'Yulafı sütle pişir ya da akşamdan beklet, whey ve çileği ekle.',[['Yulaf ezmesi',60,'g','Kuru'],['Süt',250,'ml'],['Whey protein',1,'ölçek'],['Çilek',150,'g']]),
 prc('c-yogurt','cut','b','Süzme yoğurt kasesi','🥣',3,'Yoğurdun üstüne meyve, granola ve az bal.',[[SY,300,'g'],['Orman meyvesi',150,'g'],['Granola',30,'g'],['Bal',5,'g']]),
 prc('c-tavukbulgur','cut','l','Tavuklu bulgur kasesi','🍗',25,'Tavuğu ızgarala, bulgur pilavı ve bol yeşillikle kasede birleştir.',[[TG,180,'g','Izgara / fırın'],['Bulgur',200,'g','Pişmiş pilav'],[SB2,200,'g'],[ZY,5,'g']]),
 prc('c-tonnohut','cut','l','Ton-nohut salatası','🥗',10,'Ton, nohut, domates ve salatalığı karıştır, zeytinyağı ve limonla tatlandır.',[['Ton balığı (süzülmüş)',1,'kutu'],['Haşlanmış nohut',150,'g'],['Domates',1,'adet'],['Salatalık',1,'adet'],[ZY,10,'g'],[EK,1,'dilim']]),
 prc('c-kofte','cut','l','Köfte + piyaz','🍖',25,'Yağsız kıymadan köfte yap, ızgarada pişir; fasulye, soğan ve maydanozla piyaz hazırla.',[['Yağsız kıyma',150,'g','Pişmiş (köfte / tavada)'],['Haşlanmış kuru fasulye',120,'g'],['Soğan',0.5,'adet'],[SB2,150,'g'],[ZY,5,'g']]),
 prc('c-somon','cut','d','Fırın somon + patates + brokoli','🐟',30,'Patatesi 200°C’de 15 dk fırınla, somon ve brokoliyi ekleyip 15 dk daha pişir.',[['Somon fileto',180,'g','Fırın / ızgara'],['Patates',200,'g','Fırında'],['Brokoli',200,'g','Haşlanmış / buharda']]),
 prc('c-sote','cut','d','Tavuk sote + pirinç','🍛',25,'Tavuğu sebzelerle sotele, 150 g pilavla servis et.',[[TG,180,'g','Tavada (yağlı)'],[SB2,200,'g'],['Pirinç',150,'g','Haşlanmış (yağsız)']]),
 prc('c-ispanak','cut','d','Kıymalı ıspanak + bulgur','🥬',30,'Kıymayı kavur, ıspanağı ekle; yanında bulgur pilavı ve yoğurt.',[['Yağsız kıyma',120,'g','Pişmiş (köfte / tavada)'],['Ispanak',300,'g','Pişmiş'],['Bulgur',150,'g','Pişmiş pilav'],['Yoğurt',150,'g']]),
 prc('c-whey','cut','s','Whey + süt','🥤',2,'Shaker’da karıştır.',[['Whey protein',1,'ölçek'],['Süt',250,'ml']]),
 prc('c-lor','cut','s','Lor + salatalık','🥗',3,'Lora salatalık ve baharat ekle.',[['Lor peyniri',150,'g'],['Salatalık',1,'adet']]),
 prc('c-yumurta','cut','s','2 haşlanmış yumurta + domates','🍳',10,'Yumurtaları 9 dk haşla.',[['Yumurta',2,'adet','Haşlanmış'],['Domates',1,'adet']]),
 prc('c-elma','cut','s','Elma + fıstık ezmesi','🍰',2,'Elmayı dilimle, 10 g fıstık ezmesiyle ye.',[['Elma',1,'adet'],['Fıstık ezmesi',10,'g']]),
 prc('b-yulaf','bulk','b','Bulk yulafı','🥣',5,'Yulafı sütle pişir; muz, fıstık ezmesi, bal ve whey ekle.',[['Yulaf ezmesi',90,'g','Kuru'],['Süt',300,'ml'],['Muz',1,'adet'],['Fıstık ezmesi',20,'g'],['Bal',10,'g'],['Whey protein',1,'ölçek']]),
 prc('b-menemen','bulk','b','Büyük menemen + peynir','🍳',15,'4 yumurtalı menemen; yanında 3 dilim ekmek ve peynir.',[['Yumurta',4,'adet','Çiğ'],['Domates',2,'adet'],['Sivri biber',2,'adet'],[ZY,10,'g'],[EK,3,'dilim'],['Beyaz peynir',40,'g']]),
 prc('b-tost','bulk','b','Kaşarlı hindi tost + ayran + muz','🥪',10,'Ekmek arasına kaşar ve hindi füme koy, tost makinesinde kızart.',[[EK,3,'dilim'],['Kaşar',40,'g'],['Hindi füme',60,'g'],['Ayran',300,'ml'],['Muz',1,'adet']]),
 prc('b-tavukpilav','bulk','l','Tavuk + tereyağlı pilav + ayran','🍗',30,'Tavuğu ızgarala, tereyağlı pilav ve salatayla servis et.',[[TG,200,'g','Izgara / fırın'],['Pirinç',250,'g','Pilav (tereyağlı)'],[SB2,150,'g'],[ZY,10,'g'],['Ayran',300,'ml']]),
 prc('b-kofte','bulk','l','Köfte + piyaz + ekmek','🍖',25,'Köfteyi ızgarala, piyaz ve 2 dilim ekmekle ye.',[['Yağsız kıyma',180,'g','Pişmiş (köfte / tavada)'],['Haşlanmış kuru fasulye',150,'g'],[EK,2,'dilim'],[ZY,10,'g'],[SB2,100,'g']]),
 prc('b-tonmakarna','bulk','l','Ton balıklı makarna','🍝',20,'Makarnayı haşla; ton, mısır ve yoğurtlu sosla karıştır.',[['Tam buğday makarna',300,'g','Haşlanmış'],['Ton balığı (süzülmüş)',1,'kutu'],['Mısır',50,'g'],['Yoğurt',100,'g'],[ZY,10,'g']]),
 prc('b-biftek','bulk','d','Biftek + pilav','🥩',25,'Bifteği döküm tavada mühürle; tereyağlı pilav ve sebzeyle servis et.',[['Dana bonfile',180,'g','Izgara'],['Pirinç',250,'g','Pilav (tereyağlı)'],[SB2,150,'g'],[ZY,5,'g']]),
 prc('b-somon','bulk','d','Somon + fırın patates','🐟',35,'Somon ve patatesi fırınla, zeytinyağlı sebzeyle ye.',[['Somon fileto',200,'g','Fırın / ızgara'],['Patates',300,'g','Fırında'],[SB2,150,'g'],[ZY,10,'g']]),
 prc('b-tavukbut','bulk','d','Fırın tavuk but + bulgur','🍗',40,'Tavuk butları fırınla; bulgur pilavı ve yoğurtla servis et.',[['Tavuk but',200,'g','Izgara / fırın'],['Bulgur',250,'g','Pişmiş pilav'],['Yoğurt',200,'g'],[ZY,10,'g']]),
 prc('b-shake','bulk','s','Kilo aldıran shake','🥤',3,'Hepsini blenderdan geçir.',[['Süt',300,'ml'],['Whey protein',1,'ölçek'],['Muz',1,'adet'],['Yulaf ezmesi',40,'g','Kuru'],['Fıstık ezmesi',20,'g']]),
 prc('b-yogurt','bulk','s','Süzme yoğurt + bal + ceviz','🍰',2,'Yoğurdun üstüne bal ve ceviz.',[[SY,200,'g'],['Bal',15,'g'],['Ceviz içi',30,'g']]),
 prc('b-badem','bulk','s','Badem + kuru kayısı + ayran','🥤',1,'Hazır.',[['Çiğ badem',30,'g'],['Kuru kayısı',40,'g'],['Ayran',300,'ml']])
];
PHASE_RECIPES.forEach(r=>{const t=sumMac(r.full);r.kcal=Math.round(t.k);r.p=Math.round(t.p);r.c=Math.round(t.c);r.f=Math.round(t.f);
  r.ing=r.full.map(l=>{const d=ING()[l[0]],c=stOf(d,l[3]);const raw=c&&c.y!==1&&l[2]===d.u?l[1]/c.y:l[1];return[l[0],Math.round(raw*100)/100,l[2],d.cat]})});
const PHASE_LBL={cut:'Definasyon',bulk:'Bulk'};
const phaseOk=r=>{const g=S.profile.applied?S.profile.goal:'maintain';return !r.phase||g==='maintain'||(g==='cut'?r.phase==='cut':r.phase==='bulk')};

/* ---------- hedef hesaplama (Mifflin-St Jeor) ---------- */
const ACTS=[[1.2,'Hareketsiz (masa başı, spor yok)'],[1.375,'Az aktif (haftada 1–3 antrenman)'],[1.55,'Orta aktif (haftada 3–5 antrenman)'],[1.725,'Çok aktif (haftada 6–7 antrenman)'],[1.9,'Aşırı aktif (fiziksel iş + antrenman)']];
const latestW=()=>{const b=S.body.filter(x=>x.weight!=null).sort((a,c)=>a.date<c.date?-1:1);return b.length?b[b.length-1].weight:null};
/* vücut geliştirme standartları: definasyon %0,5–1 VA/hafta (Helms 2014), bulk %0,25–0,5 VA/hafta (Iraki 2019) */
const PCT_OPTS={cut:[[0.5,'Yavaş · haftada %0,5'],[0.75,'Standart · haftada %0,75 (önerilen)'],[1,'Hızlı · haftada %1']],bulk:[[0.15,'Çok temiz · haftada %0,15 (ileri seviye)'],[0.25,'Temiz · haftada %0,25 (önerilen)'],[0.5,'Standart · haftada %0,5 (yeni başlayan)']]};
const bulkPct=()=>{try{const l=gp().lvl;return l>=3?0.15:l===1?0.25:0.25}catch(e){return 0.25}};
const BULK_TR='<b>Kas kazanımı = bulk.</b> Araştırmalara göre ideal bulk: bakım kalorisinin ~%10–20 üstü, haftada vücut ağırlığının <b>%0,25–0,5</b>\'i kadar artış (yeni/orta seviye). İleri seviyede daha yavaş (~%0,15–0,25) gitmek gerekir; daha hızlı kilo almak kası değil çoğunlukla yağı artırır. Protein 1,6–2,2 g/kg, yağ en az 0,5 g/kg. İlk 1–2 haftadaki hızlı artış su ve glikojendir, panik yapma. <span style="opacity:.7">Kaynak: Iraki ve ark. 2019 · Helms ve ark. 2023</span>';const BULK_EN='<b>Muscle gain = bulk.</b> Research-based ideal bulk: ~10–20% above maintenance calories, gaining <b>0.25–0.5%</b> of bodyweight per week (beginner/intermediate). Advanced lifters should go slower (~0.15–0.25%); gaining faster mostly adds fat, not muscle. Protein 1.6–2.2 g/kg, fat at least 0.5 g/kg. The quick gain in the first 1–2 weeks is water and glycogen, don\'t panic. <span style="opacity:.7">Sources: Iraki et al. 2019 · Helms et al. 2023</span>';const BULK_INFO_F=()=>LANG()==='en'?BULK_EN:BULK_TR;;
const rateKg=(pr,w)=>{if(pr.goal==='maintain')return 0;const ww=w||pr.weight||latestW()||75;return pr.pct!=null?ww*pr.pct/100:(pr.rate||0)};
function migrateProfile(){const pr=S.profile;if(!pr||pr.goal==='maintain'||pr.pct!=null)return false;
  pr.pct=pr.goal==='cut'?0.75:0.25;
  if(pr.applied){const r=calcTargets(pr);if(r)Object.assign(S.settings,{kcal:r.kcal,protein:r.protein,carbs:r.carbs,fat:r.fat})}
  return true}
function calcTargets(pr){
  const w=pr.weight??latestW(),h=pr.height,a=pr.age;if(!w||!h||!a)return null;
  const bmr=Math.round(10*w+6.25*h-5*a+(pr.sex==='f'?-161:5));
  const tdee=Math.round(bmr*pr.act);
  const rk=rateKg(pr,w),adj=pr.goal==='cut'?-rk*7700/7:pr.goal==='bulk'?rk*7700/7:0;
  const floor=Math.max(bmr,pr.sex==='f'?1200:1500);
  let kcal=Math.round((tdee+adj)/10)*10;const clamped=kcal<floor;if(clamped)kcal=Math.round(floor/10)*10;
  const protein=Math.round(w*(pr.goal==='cut'?2.2:pr.goal==='bulk'?2.0:1.8));
  const fat=Math.round(Math.max(kcal*0.25/9,w*0.5));
  const carbs=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));
  return{w,bmr,tdee,kcal,protein,fat,carbs,clamped};
}
function goalLabel(){const p=S.profile;if(!p.applied)return'';const k=fmt(Math.round(rateKg(p)*100)/100);
  return p.goal==='cut'?`🔥 Definasyon · −${k} kg/hafta`:p.goal==='bulk'?`💪 Kas kazanımı (bulk) · +${k} kg/hafta`:'⚖️ Kilo koruma'}

let _nsT=null;
function buzz(k){const v=(S.settings&&S.settings.vib)||'normal';if(v==='off')return;const P={light:[60],normal:[200,80,200],strong:[400,120,400,120,600]};try{navigator.vibrate&&navigator.vibrate(k||P[v]||P.normal)}catch(_){}}
function cacheLocal(){if(IDB.ok&&IDB.ready){try{localStorage.setItem(KEY,JSON.stringify(slimState()))}catch(e){}idbSaveSoon();return true}
  try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){
  try{localStorage.setItem(KEY,JSON.stringify({...S,photos:S.photos.map(p=>({...p,img:''}))}));}catch(e2){}
  if(!CL.db)setTimeout(()=>toast('⚠️ Depolama dolu: eski fotoğrafları sil ya da yedek alıp temizle'),50);return false}}
function save(){if(window.HM_DEMO){DV++;return}S._ts=Date.now();FRESH=false;DV++;cacheLocal();try{hkWeightPush();hkPushSoon();swNotify()}catch(e){}if(CL.db&&CL.status==='synced')schedulePush();if(S.profile&&S.profile.username&&typeof socPush==='function')socPush()}

/* ---------- bulut (kalıcı veritabanı) ---------- */
const CL={db:null,user:null,sample:null,base:null,status:'local',last:{},timer:null,busy:false,again:false};
/* claude.ai dışında (GitHub sitesi, iPad uygulaması) yapay zekâ: Cloudflare Worker üzerinden Gemini */
const b2d=b=>typeof b==='string'?Promise.resolve(b):new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(b)});
const GEMS={gem:1,limits:async()=>({images:true}),async json(prompt,opt={}){const C=window.HM_CONFIG||{},w=((C.push||{}).worker)||'';if(!w)throw{code:'not_granted'};
  const images=await Promise.all((opt.images||[]).slice(0,4).map(b2d));
  const r=await fetch(w+'/ai',{method:'POST',headers:{'content-type':'text/plain'},body:JSON.stringify({key:(C.push||{}).key,prompt,images})});const j=await r.json().catch(()=>({}));
  if(!r.ok){if(j.error==='no_key'){ui.gemDown=1}throw{code:r.status===429?'rate_limited':j.error==='no_key'?'gem_off':'gem_err',detail:j.detail||j.error}}
  const t=String(j.text||''),m=t.match(/\{[\s\S]*\}/);return JSON.parse(m?m[0]:t)},
  async complete(prompt,opt){return{text:JSON.stringify(await GEMS.json(prompt,opt))}}};
Object.defineProperty(CL,'sample',{configurable:true,get(){return this._smp||(!ui.gemDown&&((window.HM_CONFIG||{}).push||{}).worker?GEMS:null)},set(v){this._smp=v}});
const cuse=n=>{try{return window.claude&&window.claude.use?Promise.resolve(window.claude.use(n)).catch(()=>null):Promise.resolve(null)}catch(e){return Promise.resolve(null)}};
const LOGK=['sessions','meals','drinks','body'];
function splitState(){
  const out={},core={kind:'core'};const skip=new Set([...LOGK,'suppLog','photos','health',...(rzH()?[]:['cycle','bio'])]);
  Object.keys(S).forEach(k=>{if(!skip.has(k))core[k]=S[k]});const HK=rzH();if(!HK){if(core.profile){core.profile={...core.profile};delete core.profile.weight}if(core.settings){core.settings={...core.settings};delete core.settings.ghHR}if(Array.isArray(core.cardio))core.cardio=core.cardio.map(c=>{if(c&&c.hr!=null){const{hr,...o}=c;return o}return c})}out.core=core;
  const mk=d=>String(d).slice(0,7),M=k=>out['m-'+k]=out['m-'+k]||{kind:'month',month:k,sessions:[],meals:[],drinks:[],body:[],suppLog:{},health:{}};
  S.sessions.forEach(x=>M(mk(x.date)).sessions.push(HK||!x.hr?x:(({hr,...o})=>o)(x)));S.meals.forEach(x=>M(mk(x.date)).meals.push(x));
  S.drinks.forEach(x=>M(mk(x.date)).drinks.push(x));if(HK)S.body.forEach(x=>M(mk(x.date)).body.push(x));
  if(HK)Object.entries(S.suppLog).forEach(([d,v])=>{M(mk(d)).suppLog[d]=v});
  if(HK)Object.entries(S.health||{}).forEach(([d,v])=>{M(mk(d)).health[d]=v});
  if(HK)S.photos.forEach(p=>{if(p.img)out['p-'+p.id]={kind:'photo',...p}});
  return out;
}
function applyRemote(docs){
  const d0=defaults(),core=docs.core||{};const n={...d0};
  Object.keys(core).forEach(k=>{if(k!=='kind')n[k]=core[k]});
  LOGK.forEach(k=>n[k]=[]);n.suppLog={};n.photos=[];n.health={};
  Object.values(docs).forEach(x=>{if(x.kind==='month'){LOGK.forEach(k=>n[k].push(...(x[k]||[])));Object.assign(n.suppLog,x.suppLog||{});Object.assign(n.health,x.health||{})}
    else if(x.kind==='photo'){const{kind,...ph}=x;n.photos.push(ph)}});
  n.sessions.sort((a,b)=>a.date<b.date?-1:1);
  ['mealPlan','groc','customIng','myRecipes','profile','drinks','supps','suppLog','photos','reports','health','cardio','cycle','bio'].forEach(k=>{if(!n[k])n[k]=d0[k]});
  {const rr=core.settings&&core.settings.rz,lr=S.settings&&S.settings.rz;let r=rr;if(lr&&lr.v&&(!rr||!rr.v||(lr.at||0)>(rr.at||0))){r=lr}n.settings={...(n.settings||{}),rz:r};if(!r)delete n.settings.rz;
   if(r&&r.v&&!r.health){/* sağlık rızası yok: bulutta bu veriler yok, cihazdakini koru */
    n.health=S.health||{};n.body=S.body||[];n.photos=S.photos||[];n.suppLog=S.suppLog||{};if(S.cycle)n.cycle=S.cycle;if(S.bio)n.bio=S.bio;if(S.profile&&S.profile.weight!=null)n.profile={...n.profile,weight:S.profile.weight};if(S.settings&&S.settings.ghHR)n.settings.ghHR=S.settings.ghHR;
    const ck=c=>c&&(c.id||c.date+c.type+c.time),hm2=new Map((S.cardio||[]).filter(c=>c&&c.hr!=null).map(c=>[ck(c),c.hr]));if(hm2.size&&n.cardio)n.cardio=n.cardio.map(c=>hm2.has(ck(c))&&c.hr==null?{...c,hr:hm2.get(ck(c))}:c);
    const sh=new Map(S.sessions.filter(x=>x&&x.hr).map(x=>[x.id||x.date,x.hr]));if(sh.size)n.sessions=n.sessions.map(x=>!x.hr&&sh.has(x.id||x.date)?{...x,hr:sh.get(x.id||x.date)}:x)}}
  S=JSON.parse(JSON.stringify(n));DV++;
}
function schedulePush(){clearTimeout(CL.timer);CL.timer=setTimeout(pushAll,2000)}
const cloudSig=(id,b)=>id.startsWith('p-')?'ph|'+b.id+'|'+(b.img||'').length+'|'+(b.cap||'')+'|'+(b.date||''):JSON.stringify(b);
async function pushAll(force){
  if(!CL.db||!CL.loaded||!rzC()||!rzD()||!['synced','offline'].includes(CL.status))return;if(CL.busy){CL.again=true;return}CL.busy=true;
  const t0=performance.now();try{const docs=splitState(),col=CL.db.collection(CL.base);
    for(const [id,body] of Object.entries(docs)){const str=cloudSig(id,body);if(!force&&CL.last[id]===str)continue;
      try{await col.doc(id).set(body);CL.last[id]=str}catch(e){
        if(e&&e.code==='unavailable'){await new Promise(r=>setTimeout(r,1500+Math.random()*1000));try{await col.doc(id).set(body);CL.last[id]=str}catch(e2){CL.status='offline'}}
        else if(e&&e.code==='quota_exceeded'){toast('⚠️ Bulut depolama dolu: eski fotoğrafları sil');}
        else if(e&&(e.code==='invalid_argument'||e.code==='revoked'||e.code==='not_granted')){CL.status='local';CL.db=null;render(true);if(CL.base==='pulse')toast('Bulut kaydı kullanılamıyor; veriler bu cihazda tutuluyor');break}
        else{CL.status='offline'}}}
    if(CL.db)for(const id of Object.keys(CL.last)){if(!docs[id]){try{await col.doc(id).delete();delete CL.last[id]}catch(e){}}}
    if(CL.db&&CL.status==='offline')CL.status='synced';
    if(CL.db&&CL.status==='synced')CL.lastSync=Date.now();PERF.syncMs=performance.now()-t0;
  }finally{CL.busy=false;if(CL.again){CL.again=false;schedulePush()}}
}
async function initCloud(){
  if(!rzC()){CL.waitRz=1;return}if(CL.started)return;CL.started=1;
  const [db,user,sample]=await Promise.all([cuse('db'),cuse('user'),cuse('sample')]);
  CL.sample=sample||null;CL.user=user||null;CL.sdb=db||null;
  if(sample)render(true);
  if(!db||!user)return;
  let base=null;try{if(await user.isOwner())base='pulse';else{const id=await user.id();if(id)base='data/users/'+id}}catch(e){}
  if(!base)return;
  CL.db=db;CL.base=base;CL.status='loading';render(true);
  const t=setTimeout(()=>{if(CL.status==='loading'){CL.status='offline';render(true)}},10000);
  try{const snap=await db.collection(base).get();clearTimeout(t);CL.loaded=true;
    const docs={};snap.docs.forEach(d=>{if(d.exists)docs[d.id]=JSON.parse(JSON.stringify(d.data()))}); // buluttan gelen veri kilitli (salt okunur) olabilir: değiştirilebilir kopya al
    if(!docs.core){delete S._cf;CL.status='synced';await pushAll(true);if(!FRESH)toast('☁️ Verilerin buluta taşındı')}
    else{const remoteTs=docs.core._ts||0;
      Object.entries(docs).forEach(([id,b])=>CL.last[id]=cloudSig(id,b));
      if(!FRESH&&!window.__bootFresh&&!S._cf&&(S._ts||0)>remoteTs&&!CL.pendingRz){CL.status='synced';await pushAll()}
      else{applyRemote(docs);delete S._cf;CL.status='synced';CL.lastSync=Date.now();if(CL.pendingRz){S.settings.rz=CL.pendingRz;CL.pendingRz=null;save()}if(migrateProfile())save();cacheLocal();if(!S.active&&ui.view==='workout')ui.view='home';render(true)}}
  }catch(e){clearTimeout(t);CL.db=null;CL.err=e&&e.code||'err';CL.status=(e&&(e.code==='unavailable'||e.code==='resource_exhausted'))?'offline':'local';render(true);setTimeout(()=>socLoad(true),500)}
}
const cloudLabel=()=>({synced:'☁️ Bulutta · tüm cihazlarında aynı',loading:'⏳ Bulut yükleniyor…',offline:'⚠️ Buluta ulaşılamıyor · bu cihazda tutuluyor',local:'📱 Yalnızca bu tarayıcıda'})[CL.status];


/* ---------- sağlık (Fitbit Air / Google Health) ---------- */
let _demo=null;
function demoHR(r,g,today){const now=new Date(),lim=today?Math.floor((now.getHours()*60+now.getMinutes())/15):96,o=[],wo=68+Math.floor(r()*8);
  for(let t=0;t<96;t++){if(t>=lim){o.push(null);continue}const h=t/4;let v;
    if(h<7)v=56+g()*1.5+Math.sin(t)*1.5;else if(h<8)v=60+(h-7)*14+g()*3;else v=74+g()*7+Math.sin(t/3)*5;
    if(!today&&t>=wo&&t<wo+5)v=118+r()*28;if(h>=22.5)v=63+g()*2;o.push(Math.round(v))}return o}
function demoHealth(){if(_demo&&_demo[dkey()])return _demo;let sd=11;const r=()=>(sd=(sd*16807)%2147483647)/2147483647,g=()=>{let u=0;for(let i=0;i<6;i++)u+=r();return (u-3)*1.4};
  const hm=m=>{m=((Math.round(m)%1440)+1440)%1440;return z(Math.floor(m/60))+':'+z(m%60)},o={};
  for(let i=44;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const wk=d.getDay()===6||d.getDay()===0;
    const min=Math.round(445+g()*25+(wk?20:0)),awake=Math.round(28+r()*14),deep=Math.round(min*(0.17+r()*0.05)),rem=Math.round(min*(0.19+r()*0.05));
    const bed=23*60+45+g()*22+(wk?55:0);
    o[dkey(d)]={sleep:{min,deep,rem,light:min-deep-rem,awake,eff:Math.round(min/(min+awake)*100),bed:hm(bed),wake:hm(bed+min+awake)},
      hrv:Math.round(70+g()*5+(i===0?6:0)),rhr:Math.round(60+g()*1.5-(i===0?1:0)),spo2:Math.round(96+r()*2),resp:Math.round((14.8+g()*0.3)*10)/10,
      steps:Math.round(i===0?4200:6000+r()*5500),active:Math.round(i===0?12:18+r()*45),kcalOut:Math.round(2450+r()*450),hr15:demoHR(r,g,i===0)}}
  Object.keys(o).forEach((k,j)=>{const x=o[k];if(x&&x.steps&&!x.stepsH){const w=Array.from({length:24},(_,h)=>h<7?0:h<9?3+(j%3):h<12?6:h<14?9:h<17?5:h<20?8+(j%4):h<23?3:0.5),t=w.reduce((a,b)=>a+b,0);let lim=24;if(k===dkey())lim=new Date().getHours()+1;x.stepsH=w.map((v,h)=>h<lim?Math.round(x.steps*v/t):0)}});
  return _demo=o}
